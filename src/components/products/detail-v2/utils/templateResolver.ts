import { ComponentType } from 'react';
import { ProductComplexity, TemplateProps } from '../types';
import PremiumTemplate from '../templates/PremiumTemplate';
import StandardTemplate from '../templates/StandardTemplate';
import AccessoryTemplate from '../templates/AccessoryTemplate';
import SimpleTemplate from '../templates/SimpleTemplate';

export function resolveTemplate(complexity: ProductComplexity): ComponentType<TemplateProps> {
  switch (complexity) {
    case 'premium':
      return PremiumTemplate;
    case 'standard':
      return StandardTemplate;
    case 'accessory':
      return AccessoryTemplate;
    default:
      return SimpleTemplate;
  }
}

export function getTemplateConfig(complexity: ProductComplexity) {
  switch (complexity) {
    case 'premium':
      return {
        showAIRecommendations: true,
        showAlterationsInfo: true,
        trustSignalsLevel: 'premium' as const,
        freeShippingThreshold: 200,
        emphasizeQuality: true,
        showSizeGuide: true,
        showMeasurementHelp: true,
      };
      
    case 'standard':
      return {
        showAIRecommendations: false,
        showAlterationsInfo: false,
        trustSignalsLevel: 'standard' as const,
        freeShippingThreshold: 75,
        emphasizeQuality: false,
        showSizeGuide: true,
        showMeasurementHelp: false,
      };
      
    case 'accessory':
      return {
        showAIRecommendations: false,
        showAlterationsInfo: false,
        trustSignalsLevel: 'standard' as const,
        freeShippingThreshold: 75,
        emphasizeQuality: false,
        showSizeGuide: false,
        showMeasurementHelp: false,
        showBundleBuilder: true,
        showColorExpansion: true,
      };
      
    default:
      return {
        showAIRecommendations: false,
        showAlterationsInfo: false,
        trustSignalsLevel: 'standard' as const,
        freeShippingThreshold: 75,
        emphasizeQuality: false,
        showSizeGuide: false,
        showMeasurementHelp: false,
      };
  }
}