import { create } from 'zustand';

interface UIState {
  // Mobile nav
  isMobileNavOpen: boolean;
  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  // Mega menu
  activeMegaMenu: string | null;
  // Filters sidebar (mobile)
  isFilterDrawerOpen: boolean;
  // Auth modal
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register' | 'forgot-password';
  // Quick view
  quickViewProductId: string | null;
  // Eye exam modal
  isEyeExamModalOpen: boolean;

  // Actions
  openMobileNav: () => void;
  closeMobileNav: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  setActiveMegaMenu: (menuId: string | null) => void;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  openAuthModal: (view?: 'login' | 'register' | 'forgot-password') => void;
  closeAuthModal: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
  openEyeExamModal: () => void;
  closeEyeExamModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileNavOpen: false,
  isSearchOpen: false,
  searchQuery: '',
  activeMegaMenu: null,
  isFilterDrawerOpen: false,
  isAuthModalOpen: false,
  authModalView: 'login',
  quickViewProductId: null,
  isEyeExamModalOpen: false,

  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setActiveMegaMenu: (activeMegaMenu) => set({ activeMegaMenu }),

  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),

  openAuthModal: (view = 'login') =>
    set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  openQuickView: (productId) => set({ quickViewProductId: productId }),
  closeQuickView: () => set({ quickViewProductId: null }),

  openEyeExamModal: () => set({ isEyeExamModalOpen: true }),
  closeEyeExamModal: () => set({ isEyeExamModalOpen: false }),
}));
