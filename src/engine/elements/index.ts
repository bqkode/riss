import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

import { draw as drawStack } from './stack';
import { draw as drawRow } from './row';
import { draw as drawGrid } from './grid';
import { draw as drawScroll } from './scroll';
import { draw as drawCard } from './card';
import { draw as drawSection } from './section';
import { draw as drawModal } from './modal';
import { draw as drawBottomsheet } from './bottomsheet';
import { draw as drawText } from './text';
import { draw as drawImage } from './image';
import { draw as drawIcon } from './icon';
import { draw as drawAvatar } from './avatar';
import { draw as drawDivider } from './divider';
import { draw as drawSpacer } from './spacer';
import { draw as drawBadge } from './badge';
import { draw as drawChip } from './chip';
import { draw as drawProgress } from './progress';
import { draw as drawButton } from './button';
import { draw as drawInput } from './input';
import { draw as drawTextarea } from './textarea';
import { draw as drawCheckbox } from './checkbox';
import { draw as drawRadio } from './radio';
import { draw as drawToggle } from './toggle';
import { draw as drawSelect } from './select';
import { draw as drawSlider } from './slider';
import { draw as drawNavbar } from './navbar';
import { draw as drawTabbar } from './tabbar';
import { draw as drawTabs } from './tabs';
import { draw as drawBreadcrumb } from './breadcrumb';
import { draw as drawList } from './list';
import { draw as drawListItem } from './list-item';
import { draw as drawTable } from './table';
import { draw as drawPlaceholder } from './placeholder';
import { draw as drawAlert } from './alert';
import { draw as drawToast } from './toast';
import { draw as drawSkeleton } from './skeleton';
import { draw as drawEmptyState } from './empty-state';
import { draw as drawSpinner } from './spinner';
import { draw as drawAnnotation } from './annotation';

export const ELEMENT_RENDERERS: Record<string, (canvas: RissCanvas, box: LayoutBox, ctx: RenderContext) => void> = {
  'stack': drawStack,
  'row': drawRow,
  'grid': drawGrid,
  'scroll': drawScroll,
  'card': drawCard,
  'section': drawSection,
  'modal': drawModal,
  'bottomsheet': drawBottomsheet,
  'text': drawText,
  'image': drawImage,
  'icon': drawIcon,
  'avatar': drawAvatar,
  'divider': drawDivider,
  'spacer': drawSpacer,
  'badge': drawBadge,
  'chip': drawChip,
  'progress': drawProgress,
  'button': drawButton,
  'input': drawInput,
  'textarea': drawTextarea,
  'checkbox': drawCheckbox,
  'radio': drawRadio,
  'toggle': drawToggle,
  'select': drawSelect,
  'slider': drawSlider,
  'navbar': drawNavbar,
  'tabbar': drawTabbar,
  'tabs': drawTabs,
  'breadcrumb': drawBreadcrumb,
  'list': drawList,
  'list-item': drawListItem,
  'table': drawTable,
  'placeholder': drawPlaceholder,
  'alert': drawAlert,
  'toast': drawToast,
  'skeleton': drawSkeleton,
  'empty-state': drawEmptyState,
  'spinner': drawSpinner,
  'annotation': drawAnnotation,
};
