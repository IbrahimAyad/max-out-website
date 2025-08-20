import { AgentTask, AgentRole, TaskPriority } from '../types';

export const predefinedTasks: Record<AgentRole, AgentTask[]> = {
  'orchestrator': [],
  
  'marketing-analytics-seo': [
    {
      id: 'seo-audit-1',
      agentRole: 'marketing-analytics-seo',
      title: 'Perform comprehensive SEO audit',
      description: 'Analyze all pages for SEO optimization opportunities',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'seo-audit',
        pages: ['/', '/collections', '/products', '/wedding', '/prom']
      }
    },
    {
      id: 'ga-setup-verify',
      agentRole: 'marketing-analytics-seo',
      title: 'Verify Google Analytics tracking',
      description: 'Ensure all conversion events are properly tracked',
      priority: 'critical' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'analytics-verification',
        events: ['page_view', 'add_to_cart', 'purchase', 'view_item']
      }
    },
    {
      id: 'fb-pixel-test',
      agentRole: 'marketing-analytics-seo',
      title: 'Test Facebook Pixel implementation',
      description: 'Verify all Facebook tracking events are firing correctly',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'pixel-verification',
        events: ['PageView', 'AddToCart', 'Purchase', 'ViewContent']
      }
    }
  ],

  'ui-ux-frontend': [
    {
      id: 'mobile-opt-1',
      agentRole: 'ui-ux-frontend',
      title: 'Optimize mobile experience',
      description: 'Review and improve mobile responsiveness across all pages',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'mobile-responsive',
        pages: ['/collections', '/products', '/checkout']
      }
    },
    {
      id: 'perf-audit-1',
      agentRole: 'ui-ux-frontend',
      title: 'Improve Core Web Vitals',
      description: 'Optimize LCP, FID, and CLS metrics',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'performance-optimization',
        target: { lcp: 2.5, fid: 100, cls: 0.1 }
      }
    },
    {
      id: 'a11y-check-1',
      agentRole: 'ui-ux-frontend',
      title: 'Accessibility compliance check',
      description: 'Ensure WCAG 2.1 AA compliance',
      priority: 'medium' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'accessibility-check',
        standards: 'WCAG 2.1 AA'
      }
    }
  ],

  'e-commerce-operations': [
    {
      id: 'checkout-opt-1',
      agentRole: 'e-commerce-operations',
      title: 'Optimize checkout flow',
      description: 'Streamline checkout process to reduce abandonment',
      priority: 'critical' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'checkout-optimization',
        focus: ['form-simplification', 'progress-indicators', 'guest-checkout']
      }
    },
    {
      id: 'payment-test-1',
      agentRole: 'e-commerce-operations',
      title: 'Test payment processing',
      description: 'Verify all payment methods work correctly',
      priority: 'critical' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'payment-verification',
        methods: ['stripe', 'paypal', 'apple-pay']
      }
    },
    {
      id: 'shipping-setup-1',
      agentRole: 'e-commerce-operations',
      title: 'Configure shipping rates',
      description: 'Set up accurate shipping calculations',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'shipping-configuration',
        zones: ['US-domestic', 'Canada', 'International']
      }
    }
  ],

  'product-inventory': [
    {
      id: 'catalog-review-1',
      agentRole: 'product-inventory',
      title: 'Review product catalog completeness',
      description: 'Ensure all products have complete information',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'catalog-audit',
        checks: ['descriptions', 'images', 'sizes', 'prices']
      }
    },
    {
      id: 'inv-sync-1',
      agentRole: 'product-inventory',
      title: 'Set up inventory tracking',
      description: 'Configure real-time inventory synchronization',
      priority: 'critical' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'inventory-setup',
        features: ['low-stock-alerts', 'auto-hiding', 'size-tracking']
      }
    },
    {
      id: 'category-opt-1',
      agentRole: 'product-inventory',
      title: 'Optimize category structure',
      description: 'Review and improve product categorization',
      priority: 'medium' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'category-management',
        categories: ['suits', 'wedding', 'prom', 'accessories']
      }
    }
  ],

  'customer-experience': [
    {
      id: 'onboard-flow-1',
      agentRole: 'customer-experience',
      title: 'Create customer onboarding flow',
      description: 'Design welcome experience for new customers',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'journey-optimization',
        journey: 'new-customer-onboarding'
      }
    },
    {
      id: 'size-guide-1',
      agentRole: 'customer-experience',
      title: 'Enhance size guide experience',
      description: 'Make size selection easier for customers',
      priority: 'high' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'feature-enhancement',
        feature: 'size-guide'
      }
    },
    {
      id: 'support-setup-1',
      agentRole: 'customer-experience',
      title: 'Set up customer support channels',
      description: 'Configure chat, email, and FAQ systems',
      priority: 'medium' as TaskPriority,
      status: 'pending',
      metadata: {
        type: 'support-configuration',
        channels: ['chat', 'email', 'faq']
      }
    }
  ]
};

// Production readiness checklist tasks
export const productionChecklistTasks: AgentTask[] = [
  {
    id: 'prod-ssl-check',
    agentRole: 'ui-ux-frontend',
    title: 'Verify SSL certificate',
    description: 'Ensure HTTPS is properly configured',
    priority: 'critical' as TaskPriority,
    status: 'pending',
    metadata: { type: 'security-check' }
  },
  {
    id: 'prod-404-pages',
    agentRole: 'ui-ux-frontend',
    title: 'Set up 404 error pages',
    description: 'Create user-friendly error pages',
    priority: 'high' as TaskPriority,
    status: 'pending',
    metadata: { type: 'error-handling' }
  },
  {
    id: 'prod-sitemap',
    agentRole: 'marketing-analytics-seo',
    title: 'Generate XML sitemap',
    description: 'Create and submit sitemap to search engines',
    priority: 'high' as TaskPriority,
    status: 'pending',
    metadata: { type: 'seo-technical' }
  },
  {
    id: 'prod-robots-txt',
    agentRole: 'marketing-analytics-seo',
    title: 'Configure robots.txt',
    description: 'Set up proper crawling directives',
    priority: 'medium' as TaskPriority,
    status: 'pending',
    metadata: { type: 'seo-technical' }
  },
  {
    id: 'prod-backup-system',
    agentRole: 'e-commerce-operations',
    title: 'Set up automated backups',
    description: 'Configure regular data backups',
    priority: 'critical' as TaskPriority,
    status: 'pending',
    metadata: { type: 'system-maintenance' }
  },
  {
    id: 'prod-monitoring',
    agentRole: 'e-commerce-operations',
    title: 'Configure uptime monitoring',
    description: 'Set up alerts for downtime',
    priority: 'high' as TaskPriority,
    status: 'pending',
    metadata: { type: 'system-monitoring' }
  },
  {
    id: 'prod-legal-pages',
    agentRole: 'customer-experience',
    title: 'Review legal pages',
    description: 'Ensure privacy policy and terms are up to date',
    priority: 'critical' as TaskPriority,
    status: 'pending',
    metadata: { type: 'compliance' }
  },
  {
    id: 'prod-email-testing',
    agentRole: 'customer-experience',
    title: 'Test all email templates',
    description: 'Verify order confirmations and notifications',
    priority: 'high' as TaskPriority,
    status: 'pending',
    metadata: { type: 'email-verification' }
  }
];

// Get all tasks for initial load
export function getAllPredefinedTasks(): AgentTask[] {
  const allTasks: AgentTask[] = [];
  
  Object.values(predefinedTasks).forEach(tasks => {
    allTasks.push(...tasks);
  });
  
  allTasks.push(...productionChecklistTasks);
  
  return allTasks;
}

// Get tasks by priority
export function getTasksByPriority(priority: TaskPriority): AgentTask[] {
  return getAllPredefinedTasks().filter(task => task.priority === priority);
}

// Get critical tasks for production
export function getCriticalProductionTasks(): AgentTask[] {
  return getAllPredefinedTasks().filter(task => 
    task.priority === 'critical' && task.status === 'pending'
  );
}