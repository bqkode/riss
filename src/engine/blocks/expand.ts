import { RissElement, BlockUsage, CustomBlockDef } from '../../types/riss';
import { interpolateTemplate } from './interpolate';

import { expand as expandHero } from './definitions/hero';
import { expand as expandPageHeader } from './definitions/page-header';
import { expand as expandAnnouncementBar } from './definitions/announcement-bar';
import { expand as expandSidebarNav } from './definitions/sidebar-nav';
import { expand as expandTopNav } from './definitions/top-nav';
import { expand as expandBreadcrumbHeader } from './definitions/breadcrumb-header';
import { expand as expandBottomNav } from './definitions/bottom-nav';
import { expand as expandSideBySide } from './definitions/side-by-side';
import { expand as expandAlternatingRows } from './definitions/alternating-rows';
import { expand as expandContentCarousel } from './definitions/content-carousel';
import { expand as expandBlogCardGrid } from './definitions/blog-card-grid';
import { expand as expandTimeline } from './definitions/timeline';
import { expand as expandRichText } from './definitions/rich-text';
import { expand as expandFeatureGrid } from './definitions/feature-grid';
import { expand as expandFeatureList } from './definitions/feature-list';
import { expand as expandChecklist } from './definitions/checklist';
import { expand as expandHowItWorks } from './definitions/how-it-works';
import { expand as expandLogoBar } from './definitions/logo-bar';
import { expand as expandTestimonialCard } from './definitions/testimonial-card';
import { expand as expandTestimonialGrid } from './definitions/testimonial-grid';
import { expand as expandStatsRow } from './definitions/stats-row';
import { expand as expandRatingBlock } from './definitions/rating-block';
import { expand as expandPricingTable } from './definitions/pricing-table';
import { expand as expandPricingCard } from './definitions/pricing-card';
import { expand as expandCtaBanner } from './definitions/cta-banner';
import { expand as expandCtaInline } from './definitions/cta-inline';
import { expand as expandCtaWithInput } from './definitions/cta-with-input';
import { expand as expandLoginForm } from './definitions/login-form';
import { expand as expandSignupForm } from './definitions/signup-form';
import { expand as expandContactForm } from './definitions/contact-form';
import { expand as expandSearchWithFilters } from './definitions/search-with-filters';
import { expand as expandMultiStepForm } from './definitions/multi-step-form';
import { expand as expandSettingsForm } from './definitions/settings-form';
import { expand as expandStatCardsRow } from './definitions/stat-cards-row';
import { expand as expandDataTable } from './definitions/data-table';
import { expand as expandActivityFeed } from './definitions/activity-feed';
import { expand as expandChartCard } from './definitions/chart-card';
import { expand as expandKanbanBoard } from './definitions/kanban-board';
import { expand as expandProductCardGrid } from './definitions/product-card-grid';
import { expand as expandProductDetail } from './definitions/product-detail';
import { expand as expandCartSummary } from './definitions/cart-summary';
import { expand as expandCheckoutSteps } from './definitions/checkout-steps';
import { expand as expandProfileHeader } from './definitions/profile-header';
import { expand as expandTeamGrid } from './definitions/team-grid';
import { expand as expandAvatarList } from './definitions/avatar-list';
import { expand as expandCardGrid } from './definitions/card-grid';
import { expand as expandMediaGallery } from './definitions/media-gallery';
import { expand as expandAccordion } from './definitions/accordion';
import { expand as expandRankedList } from './definitions/ranked-list';
import { expand as expandEmptyStateBlock } from './definitions/empty-state-block';
import { expand as expandErrorPage } from './definitions/error-page';
import { expand as expandLoadingSkeleton } from './definitions/loading-skeleton';
import { expand as expandConfirmation } from './definitions/confirmation';
import { expand as expandChatThread } from './definitions/chat-thread';
import { expand as expandCommentThread } from './definitions/comment-thread';
import { expand as expandNotificationList } from './definitions/notification-list';
import { expand as expandFooter } from './definitions/footer';

const CORE_BLOCKS: Record<string, (params: any) => RissElement[]> = {
  'hero': expandHero,
  'page-header': expandPageHeader,
  'announcement-bar': expandAnnouncementBar,
  'sidebar-nav': expandSidebarNav,
  'top-nav': expandTopNav,
  'breadcrumb-header': expandBreadcrumbHeader,
  'bottom-nav': expandBottomNav,
  'side-by-side': expandSideBySide,
  'alternating-rows': expandAlternatingRows,
  'content-carousel': expandContentCarousel,
  'blog-card-grid': expandBlogCardGrid,
  'timeline': expandTimeline,
  'rich-text': expandRichText,
  'feature-grid': expandFeatureGrid,
  'feature-list': expandFeatureList,
  'checklist': expandChecklist,
  'how-it-works': expandHowItWorks,
  'logo-bar': expandLogoBar,
  'testimonial-card': expandTestimonialCard,
  'testimonial-grid': expandTestimonialGrid,
  'stats-row': expandStatsRow,
  'rating-block': expandRatingBlock,
  'pricing-table': expandPricingTable,
  'pricing-card': expandPricingCard,
  'cta-banner': expandCtaBanner,
  'cta-inline': expandCtaInline,
  'cta-with-input': expandCtaWithInput,
  'login-form': expandLoginForm,
  'signup-form': expandSignupForm,
  'contact-form': expandContactForm,
  'search-with-filters': expandSearchWithFilters,
  'multi-step-form': expandMultiStepForm,
  'settings-form': expandSettingsForm,
  'stat-cards-row': expandStatCardsRow,
  'data-table': expandDataTable,
  'activity-feed': expandActivityFeed,
  'chart-card': expandChartCard,
  'kanban-board': expandKanbanBoard,
  'product-card-grid': expandProductCardGrid,
  'product-detail': expandProductDetail,
  'cart-summary': expandCartSummary,
  'checkout-steps': expandCheckoutSteps,
  'profile-header': expandProfileHeader,
  'team-grid': expandTeamGrid,
  'avatar-list': expandAvatarList,
  'card-grid': expandCardGrid,
  'media-gallery': expandMediaGallery,
  'accordion': expandAccordion,
  'ranked-list': expandRankedList,
  'empty-state-block': expandEmptyStateBlock,
  'error-page': expandErrorPage,
  'loading-skeleton': expandLoadingSkeleton,
  'confirmation': expandConfirmation,
  'chat-thread': expandChatThread,
  'comment-thread': expandCommentThread,
  'notification-list': expandNotificationList,
  'footer': expandFooter,
};

export function expandBlock(block: BlockUsage, customBlocks?: CustomBlockDef[]): RissElement[] {
  // Check core blocks first
  if (CORE_BLOCKS[block.block]) {
    return CORE_BLOCKS[block.block](block);
  }
  // Check custom blocks
  if (customBlocks) {
    const def = customBlocks.find(b => b.id === block.block);
    if (def) {
      return interpolateTemplate(def.template, def.params, block);
    }
  }
  // Unknown block: return a placeholder
  return [{
    type: 'placeholder',
    label: `Unknown block: ${block.block}`,
    height: 100,
    background: 'placeholder',
  }];
}

export function expandAllBlocks(children: any[], customBlocks?: CustomBlockDef[]): RissElement[] {
  return children.map(child => {
    if (child.block) {
      const expanded = expandBlock(child as BlockUsage, customBlocks);
      // Recursively expand any nested blocks within expanded elements
      const recursiveExpanded = expandAllBlocks(expanded, customBlocks);
      // Wrap in a section-like container with the block's role/annotation/next/id
      if (child.role || child.annotation || child.next || child.id) {
        return {
          type: 'stack',
          id: child.id,
          role: child.role,
          annotation: child.annotation,
          next: child.next,
          children: recursiveExpanded,
        } as RissElement;
      }
      // If expanded to single element, return it directly
      if (recursiveExpanded.length === 1) return recursiveExpanded[0];
      // Multiple elements: wrap in stack
      return { type: 'stack', children: recursiveExpanded } as RissElement;
    }
    // Recurse into non-block element children
    if (child.children && Array.isArray(child.children)) {
      return {
        ...child,
        children: expandAllBlocks(child.children, customBlocks),
      };
    }
    return child;
  });
}
