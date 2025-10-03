'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface CreateMarketModalProps {
  onClose: () => void;
}

export function CreateMarketModal({ onClose }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [resolutionType, setResolutionType] = useState<'oracle' | 'community'>('oracle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!question.trim()) {
      newErrors.question = 'Market question is required';
    } else if (question.trim().length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    } else if (!question.includes('?')) {
      newErrors.question = 'Question should end with a question mark';
    }

    if (!expiresAt) {
      newErrors.expiresAt = 'Expiration date is required';
    } else {
      const expirationDate = new Date(expiresAt);
      const now = new Date();
      const minDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

      if (expirationDate <= minDate) {
        newErrors.expiresAt = 'Expiration must be at least 1 hour from now';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate market creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Market created:', { question, expiresAt, resolutionType });
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to create market. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
      <div
        className="glass-card max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-fg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 id="create-modal-title" className="text-2xl font-bold text-fg mb-2">
            Create Prediction Market
          </h2>
          <p className="text-text-secondary text-sm">
            Set up a new prediction market for your community
          </p>
        </div>

        {/* Question Input */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm font-medium mb-2">
            Market Question *
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question) {
                setErrors((prev) => ({ ...prev, question: '' }));
              }
            }}
            className={`w-full bg-surface border rounded-md px-4 py-3 text-fg focus:outline-none focus:ring-2 ${
              errors.question ? 'border-error focus:ring-error' : 'border-border focus:ring-accent'
            }`}
            placeholder="Will ETH hit $5k by end of month?"
            maxLength={200}
            aria-describedby={errors.question ? 'question-error' : 'question-help'}
          />
          {errors.question && (
            <p id="question-error" className="text-error text-sm mt-1 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.question}</span>
            </p>
          )}
          <p id="question-help" className="text-text-muted text-xs mt-1">
            {question.length}/200 characters • Make sure to include a question mark
          </p>
        </div>

        {/* Expiration Date */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Expiration Date & Time *
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => {
              setExpiresAt(e.target.value);
              if (errors.expiresAt) {
                setErrors((prev) => ({ ...prev, expiresAt: '' }));
              }
            }}
            min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
            className={`w-full bg-surface border rounded-md px-4 py-3 text-fg focus:outline-none focus:ring-2 ${
              errors.expiresAt ? 'border-error focus:ring-error' : 'border-border focus:ring-accent'
            }`}
            aria-describedby={errors.expiresAt ? 'expires-error' : undefined}
          />
          {errors.expiresAt && (
            <p id="expires-error" className="text-error text-sm mt-1 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.expiresAt}</span>
            </p>
          )}
        </div>

        {/* Resolution Type */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm font-medium mb-3">
            Resolution Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setResolutionType('oracle')}
              className={`p-4 rounded-md border-2 transition-all duration-200 ${
                resolutionType === 'oracle'
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface hover:bg-surface-hover'
              }`}
            >
              <DollarSign className="w-6 h-6 text-accent mb-2" />
              <h4 className="font-semibold text-fg mb-1">Oracle</h4>
              <p className="text-xs text-text-muted">Auto-resolve using price feeds (Chainlink)</p>
            </button>
            <button
              onClick={() => setResolutionType('community')}
              className={`p-4 rounded-md border-2 transition-all duration-200 ${
                resolutionType === 'community'
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface hover:bg-surface-hover'
              }`}
            >
              <div className="w-6 h-6 text-primary mb-2">👥</div>
              <h4 className="font-semibold text-fg mb-1">Community</h4>
              <p className="text-xs text-text-muted">Resolve via community voting</p>
            </button>
          </div>
        </div>

        {/* Oracle Config (if oracle selected) */}
        {resolutionType === 'oracle' && (
          <div className="mb-6 p-4 bg-surface rounded-md border border-border">
            <h4 className="font-semibold text-fg mb-3">Oracle Configuration</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-text-muted text-sm mb-1">Asset</label>
                <select className="w-full bg-surface-hover border border-border rounded-md px-3 py-2 text-fg">
                  <option>ETH/USD</option>
                  <option>BTC/USD</option>
                  <option>SOL/USD</option>
                </select>
              </div>
              <div>
                <label className="block text-text-muted text-sm mb-1">Target Price</label>
                <input
                  type="number"
                  className="w-full bg-surface-hover border border-border rounded-md px-3 py-2 text-fg"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-3 bg-error/10 border border-error/30 rounded-md">
            <p className="text-error text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.general}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className={`btn-secondary ${isSubmitting ? 'btn-disabled' : ''}`}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`btn-primary ${isSubmitting || !question.trim() || !expiresAt ? 'btn-disabled' : ''}`}
            disabled={isSubmitting || !question.trim() || !expiresAt}
            type="button"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <div className="loading-spinner"></div>
                <span>Creating...</span>
              </span>
            ) : (
              'Create Market'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
