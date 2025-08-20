import { useState, useCallback } from 'react';
import { fashionClipAutoTagging, AutoTaggingResult } from '@/lib/services/fashionClipAutoTagging';

interface UseAutoTaggingOptions {
  autoApply?: boolean;           // Automatically apply suggested tags
  minConfidence?: number;        // Minimum confidence for auto-apply
  onTagsUpdated?: (productId: string, tags: string[]) => void;
  onError?: (error: Error) => void;
}

interface TaggingState {
  isAnalyzing: boolean;
  lastResult: AutoTaggingResult | null;
  error: string | null;
  pendingSuggestions: Map<string, string[]>;
}

export function useAutoTagging(options: UseAutoTaggingOptions = {}) {
  const {
    autoApply = false,
    minConfidence = 0.7,
    onTagsUpdated,
    onError
  } = options;

  const [state, setState] = useState<TaggingState>({
    isAnalyzing: false,
    lastResult: null,
    error: null,
    pendingSuggestions: new Map()
  });

  /**
   * Analyze a single product for auto-tagging
   */
  const analyzeProduct = useCallback(async (
    productId: string,
    imageUrl: string,
    existingTags: string[] = [],
    productName?: string,
    productDescription?: string
  ): Promise<AutoTaggingResult | null> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const result = await fashionClipAutoTagging.autoTagProduct(
        productId,
        imageUrl,
        existingTags,
        productName,
        productDescription
      );

      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        lastResult: result,
        pendingSuggestions: new Map(prev.pendingSuggestions.set(productId, result.addedTags))
      }));

      // Auto-apply if enabled and confidence is high enough
      if (autoApply && result.seoScore >= minConfidence * 100) {
        const newTags = [...existingTags, ...result.addedTags];
        onTagsUpdated?.(productId, newTags);
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Auto-tagging failed';
      setState(prev => ({ ...prev, isAnalyzing: false, error: errorMsg }));
      onError?.(error instanceof Error ? error : new Error(errorMsg));
      return null;
    }
  }, [autoApply, minConfidence, onTagsUpdated, onError]);

  /**
   * Apply pending suggestions for a product
   */
  const applySuggestions = useCallback((
    productId: string,
    existingTags: string[],
    selectedSuggestions?: string[]
  ) => {
    const suggestions = state.pendingSuggestions.get(productId) || [];
    const tagsToApply = selectedSuggestions || suggestions;
    const newTags = [...existingTags, ...tagsToApply];
    
    // Remove from pending
    setState(prev => {
      const newPending = new Map(prev.pendingSuggestions);
      newPending.delete(productId);
      return { ...prev, pendingSuggestions: newPending };
    });

    onTagsUpdated?.(productId, newTags);
  }, [state.pendingSuggestions, onTagsUpdated]);

  /**
   * Reject suggestions for a product
   */
  const rejectSuggestions = useCallback((productId: string) => {
    setState(prev => {
      const newPending = new Map(prev.pendingSuggestions);
      newPending.delete(productId);
      return { ...prev, pendingSuggestions: newPending };
    });
  }, []);

  /**
   * Bulk analyze multiple products
   */
  const bulkAnalyze = useCallback(async (
    products: Array<{
      id: string;
      imageUrl: string;
      existingTags: string[];
      name?: string;
      description?: string;
    }>
  ): Promise<Map<string, AutoTaggingResult>> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const results = await fashionClipAutoTagging.bulkAutoTag(products);
      
      // Update pending suggestions
      setState(prev => {
        const newPending = new Map(prev.pendingSuggestions);
        results.forEach((result, productId) => {
          if (result.addedTags.length > 0) {
            newPending.set(productId, result.addedTags);
          }
        });
        
        return {
          ...prev,
          isAnalyzing: false,
          pendingSuggestions: newPending
        };
      });

      // Auto-apply high-confidence results
      if (autoApply) {
        results.forEach((result, productId) => {
          if (result.seoScore >= minConfidence * 100) {
            const product = products.find(p => p.id === productId);
            if (product) {
              const newTags = [...product.existingTags, ...result.addedTags];
              onTagsUpdated?.(productId, newTags);
            }
          }
        });
      }

      return results;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Bulk analysis failed';
      setState(prev => ({ ...prev, isAnalyzing: false, error: errorMsg }));
      onError?.(error instanceof Error ? error : new Error(errorMsg));
      return new Map();
    }
  }, [autoApply, minConfidence, onTagsUpdated, onError]);

  /**
   * Get SEO recommendations for current tags
   */
  const getSEORecommendations = useCallback((tags: string[]) => {
    return fashionClipAutoTagging.getTagSuggestions(tags);
  }, []);

  /**
   * Generate SEO meta tags
   */
  const generateSEOMeta = useCallback((tags: string[], productName: string) => {
    return fashionClipAutoTagging.generateSEOMetaTags(tags, productName);
  }, []);

  /**
   * Check for tag conflicts before adding
   */
  const validateTags = useCallback((existingTags: string[], newTags: string[]) => {
    const result = fashionClipAutoTagging['deduplicateTags'](existingTags, newTags);
    return {
      validTags: result.addedTags,
      conflicts: result.conflictTags,
      duplicates: result.skippedTags
    };
  }, []);

  return {
    // State
    isAnalyzing: state.isAnalyzing,
    lastResult: state.lastResult,
    error: state.error,
    pendingSuggestions: state.pendingSuggestions,

    // Actions
    analyzeProduct,
    applySuggestions,
    rejectSuggestions,
    bulkAnalyze,

    // Utils
    getSEORecommendations,
    generateSEOMeta,
    validateTags,

    // Computed
    hasPendingSuggestions: state.pendingSuggestions.size > 0,
    pendingCount: state.pendingSuggestions.size
  };
}

/**
 * Hook for real-time tag validation during input
 */
export function useTagValidation() {
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    conflicts: string[];
    suggestions: string[];
    seoScore: number;
  }>({
    isValid: true,
    conflicts: [],
    suggestions: [],
    seoScore: 0
  });

  const validateTags = useCallback((tags: string[]) => {
    const suggestions = fashionClipAutoTagging.getTagSuggestions(tags);
    const seoScore = fashionClipAutoTagging['calculateSEOScore'](tags);
    
    setValidationState({
      isValid: suggestions.redundant.length === 0,
      conflicts: suggestions.redundant,
      suggestions: suggestions.missing,
      seoScore
    });
  }, []);

  return {
    ...validationState,
    validateTags
  };
}

/**
 * Hook for managing auto-tagging workflows
 */
export function useAutoTaggingWorkflow() {
  const [workflow, setWorkflow] = useState<{
    step: 'analyze' | 'review' | 'apply' | 'complete';
    productId: string | null;
    suggestions: string[];
    approved: string[];
    rejected: string[];
  }>({
    step: 'analyze',
    productId: null,
    suggestions: [],
    approved: [],
    rejected: []
  });

  const startWorkflow = useCallback((productId: string) => {
    setWorkflow({
      step: 'analyze',
      productId,
      suggestions: [],
      approved: [],
      rejected: []
    });
  }, []);

  const setSuggestions = useCallback((suggestions: string[]) => {
    setWorkflow(prev => ({
      ...prev,
      step: 'review',
      suggestions
    }));
  }, []);

  const approveTag = useCallback((tag: string) => {
    setWorkflow(prev => ({
      ...prev,
      approved: [...prev.approved, tag],
      suggestions: prev.suggestions.filter(t => t !== tag)
    }));
  }, []);

  const rejectTag = useCallback((tag: string) => {
    setWorkflow(prev => ({
      ...prev,
      rejected: [...prev.rejected, tag],
      suggestions: prev.suggestions.filter(t => t !== tag)
    }));
  }, []);

  const completeWorkflow = useCallback(() => {
    setWorkflow(prev => ({ ...prev, step: 'complete' }));
  }, []);

  const resetWorkflow = useCallback(() => {
    setWorkflow({
      step: 'analyze',
      productId: null,
      suggestions: [],
      approved: [],
      rejected: []
    });
  }, []);

  return {
    workflow,
    startWorkflow,
    setSuggestions,
    approveTag,
    rejectTag,
    completeWorkflow,
    resetWorkflow
  };
}