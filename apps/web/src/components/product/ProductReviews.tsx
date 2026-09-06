'use client';

import { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, X } from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';

interface ProductReviewsProps {
  product: ProductItem;
}

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  fitAssessment: 'Runs Narrow' | 'True to Size' | 'Runs Wide';
  helpfulCount: number;
  isVerified: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Vikramaditya S.',
    rating: 5,
    date: '3 weeks ago',
    title: 'The craftsmanship rivals my Japanese Oliver Peoples frames',
    comment:
      'The beveling on the acetate and the titanium core wire filigree is stunning in person. I opted for the 1.67 ultra-thin high index lenses with blue defense and the optical clarity is spotless. Customer support verified my prescription within an hour.',
    fitAssessment: 'True to Size',
    helpfulCount: 24,
    isVerified: true,
  },
  {
    id: 'rev-2',
    author: 'Ananya M.',
    rating: 5,
    date: '1 month ago',
    title: 'Featherweight comfort and flawless design',
    comment:
      'I wear these 12+ hours daily in front of monitors. Zero pressure behind the ears and the nose bridge sits comfortably without sliding. Beautiful packaging with leather case as well.',
    fitAssessment: 'True to Size',
    helpfulCount: 18,
    isVerified: true,
  },
  {
    id: 'rev-3',
    author: 'Kabir R.',
    rating: 4,
    date: '2 months ago',
    title: 'Top-tier luxury silhouette',
    comment:
      'Very premium weight and feel. Only minor critique is the case is slightly bulky for smaller pockets, but the glasses themselves are 10/10.',
    fitAssessment: 'True to Size',
    helpfulCount: 11,
    isVerified: true,
  },
];

export const ProductReviews = ({ product }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Review form state
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formFit, setFormFit] = useState<'Runs Narrow' | 'True to Size' | 'Runs Wide'>('True to Size');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formComment) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: formName,
      rating: formRating,
      date: 'Just now',
      title: formTitle || 'My Experience with this Frame',
      comment: formComment,
      fitAssessment: formFit,
      helpfulCount: 0,
      isVerified: true,
    };

    setReviews([newRev, ...reviews]);
    setIsModalOpen(false);
    setFormName('');
    setFormTitle('');
    setFormComment('');
  };

  const handleHelpful = (id: string) => {
    if (helpfulLiked[id]) return;
    setHelpfulLiked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)),
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-obsidian-200/80 space-y-8 shadow-sm">
      {/* Header & Overall Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-obsidian-100 pb-8">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="font-serif text-5xl font-medium text-obsidian-950">
              {product.rating}
            </span>
            <div className="flex items-center text-gold justify-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs text-obsidian-500 block mt-1">
              Based on {product.reviewCount} reviews
            </span>
          </div>

          <div className="h-16 w-px bg-obsidian-200 hidden sm:block" />

          {/* Rating Distribution Bar */}
          <div className="space-y-1.5 min-w-[200px] text-xs">
            {[
              { stars: 5, pct: 88 },
              { stars: 4, pct: 9 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 0 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="w-12 text-obsidian-500">{row.stars} Stars</span>
                <div className="flex-1 h-1.5 bg-obsidian-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-obsidian-400 text-[11px]">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fit Guarantee & Write Review CTA */}
        <div className="flex flex-col sm:items-end gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>96% of buyers report: <strong>True to Size</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Verified Review</span>
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-obsidian-50/60 border border-obsidian-200/60 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-obsidian-950">
                    {rev.author}
                  </span>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified Owner
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-obsidian-400">
                  <div className="flex items-center text-gold gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                  <span>•</span>
                  <span>{rev.date}</span>
                  <span>•</span>
                  <span className="text-obsidian-600 font-medium">Fit: {rev.fitAssessment}</span>
                </div>
              </div>

              {/* Helpful Upvote Button */}
              <button
                type="button"
                onClick={() => handleHelpful(rev.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  helpfulLiked[rev.id]
                    ? 'border-gold text-gold-700 bg-gold/10 font-semibold'
                    : 'border-obsidian-200 text-obsidian-600 hover:border-obsidian-400'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>

            <h4 className="font-serif text-base font-semibold text-obsidian-900">
              {rev.title}
            </h4>
            <p className="text-xs text-obsidian-600 leading-relaxed">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Write a Review Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-obsidian-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-obsidian-400 hover:text-obsidian-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-medium text-obsidian-950 mb-1">
              Share Your Optical Experience
            </h3>
            <p className="text-xs text-obsidian-500 mb-6">
              Reviewing: <strong>{product.name}</strong>
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating
                            ? 'fill-gold text-gold'
                            : 'text-obsidian-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                  Fit Evaluation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Runs Narrow', 'True to Size', 'Runs Wide'] as const).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setFormFit(fit)}
                      className={`text-xs py-2 rounded-xl border font-medium transition-all ${
                        formFit === fit
                          ? 'bg-obsidian-950 text-white border-obsidian-950'
                          : 'border-obsidian-200 text-obsidian-700 hover:bg-obsidian-50'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Siddharth Rao"
                  className="w-full text-xs p-3 rounded-xl border border-obsidian-200 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Incredible frame balance & optical clarity"
                  className="w-full text-xs p-3 rounded-xl border border-obsidian-200 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                  Detailed Review
                </label>
                <textarea
                  rows={4}
                  required
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Tell us about the fit, lens clarity, weight, and craft..."
                  className="w-full text-xs p-3 rounded-xl border border-obsidian-200 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-obsidian-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-obsidian-800 transition-colors"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
