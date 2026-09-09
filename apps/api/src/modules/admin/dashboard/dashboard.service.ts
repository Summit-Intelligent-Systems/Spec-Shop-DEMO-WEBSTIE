import { prisma } from '../../../config/database';

/**
 * Get key business metrics for the admin dashboard.
 */
export const getDashboardStats = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    revenueLastMonth,
    totalRevenue,
    ordersToday,
    pendingOrders,
    processingOrders,
    totalOrders,
    ordersThisMonth,
    ordersLastMonth,
    totalCustomers,
    newCustomersToday,
    activeCustomersThisMonth,
    customersLastMonth,
    totalProducts,
    outOfStockProducts,
    lowStockCount,
  ] = await Promise.all([
    // Revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfToday }, paymentStatus: 'SUCCESS' },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfWeek }, paymentStatus: 'SUCCESS' },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'SUCCESS' },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        paymentStatus: 'SUCCESS',
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: 'SUCCESS' },
    }),

    // Orders
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),

    // Customers
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({
      where: { role: 'CUSTOMER', createdAt: { gte: startOfToday } },
    }),
    prisma.user.count({
      where: { role: 'CUSTOMER', lastLoginAt: { gte: startOfMonth } },
    }),
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),

    // Products
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.product.count({ where: { status: 'OUT_OF_STOCK' } }),
    prisma.inventory.count({
      where: {
        quantity: { lte: prisma.inventory.fields.lowStockThreshold ? 5 : 5 },
      },
    }),
  ]);

  const revenueThisMonthVal = Number(revenueThisMonth._sum.total || 0);
  const revenueLastMonthVal = Number(revenueLastMonth._sum.total || 0);
  const revenueGrowth = revenueLastMonthVal > 0
    ? ((revenueThisMonthVal - revenueLastMonthVal) / revenueLastMonthVal) * 100
    : 0;

  const ordersGrowth = ordersLastMonth > 0
    ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100
    : 0;

  const customersGrowth = customersLastMonth > 0
    ? ((totalCustomers - customersLastMonth) / customersLastMonth) * 100
    : 0;

  return {
    revenue: {
      today: Number(revenueToday._sum.total || 0),
      thisWeek: Number(revenueThisWeek._sum.total || 0),
      thisMonth: revenueThisMonthVal,
      total: Number(totalRevenue._sum.total || 0),
      growth: Math.round(revenueGrowth * 10) / 10,
    },
    orders: {
      today: ordersToday,
      pending: pendingOrders,
      processing: processingOrders,
      total: totalOrders,
      thisMonth: ordersThisMonth,
      growth: Math.round(ordersGrowth * 10) / 10,
    },
    customers: {
      total: totalCustomers,
      newToday: newCustomersToday,
      activeThisMonth: activeCustomersThisMonth,
      growth: Math.round(customersGrowth * 10) / 10,
    },
    products: {
      total: totalProducts,
      outOfStock: outOfStockProducts,
      lowStock: lowStockCount,
    },
  };
};

/**
 * Get recent orders for the dashboard.
 */
export const getRecentOrders = async (limit = 10) => {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
      user: {
        select: {
          email: true,
          profile: {
            select: { firstName: true, lastName: true },
          },
        },
      },
      items: {
        take: 1,
        select: {
          productName: true,
          quantity: true,
        },
      },
    },
  });
};

/**
 * Get revenue chart data (daily totals for current month).
 */
export const getRevenueChart = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startOfMonth },
      paymentStatus: 'SUCCESS',
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by day
  const dailyMap = new Map<string, { revenue: number; orders: number }>();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Initialize all days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dailyMap.set(dateStr, { revenue: 0, orders: 0 });
  }

  // Fill with real data
  for (const order of orders) {
    const dateStr = order.createdAt.toISOString().slice(0, 10);
    const existing = dailyMap.get(dateStr) || { revenue: 0, orders: 0 };
    existing.revenue += Number(order.total);
    existing.orders += 1;
    dailyMap.set(dateStr, existing);
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    revenue: Math.round(data.revenue * 100) / 100,
    orders: data.orders,
  }));
};

/**
 * Get top-selling products.
 */
export const getTopProducts = async (limit = 5) => {
  return prisma.product.findMany({
    take: limit,
    orderBy: { purchaseCount: 'desc' },
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      purchaseCount: true,
      viewCount: true,
      averageRating: true,
      media: {
        take: 1,
        orderBy: { sortOrder: 'asc' },
        select: { url: true },
      },
    },
  });
};
