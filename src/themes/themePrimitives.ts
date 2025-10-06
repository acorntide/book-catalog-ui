// Raw design tokens + reusable sx snippets.

import type { PaletteOptions, Theme } from '@mui/material/styles';

// ====== Color tokens ======
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: { main: '#556cd6' },
  secondary: { main: '#19857b' },
  background: { default: '#f5f7fb', paper: '#ffffff' },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#8ea2ff' },
  secondary: { main: '#64d8cb' },
  background: { default: '#0f1115', paper: '#12161c' },
};

// ====== Layout ======
export const layout = {
  rail: { width: 80 },
  drawer: { width: 280 },
  header: { height: 64 },
};

// ====== Shape / radii ======
export const shape = {
  borderRadius: 3,
};

// ====== Sizes ======
const GOODREADS_W = 328;
const GOODREADS_H = 500;
const COVER_SCALE = 0.75; // scale down covers by ~25%
export const sizes = {
  cover: {
    height: Math.round(240 * COVER_SCALE),
    width: Math.round((240 * GOODREADS_W) / GOODREADS_H * COVER_SCALE),
  },
  modal: {
    width: 1100,
    maxHeight: '95vh' as const,
    padding: 3, // theme spacing units
  },
};

// ====== Reusable sx helpers ======
const RAIL_EXPANDED_EXTRA = 200; // extra width when expanded (adjust as desired)
export const RAIL_EXPANDED_WIDTH = layout.rail.width + RAIL_EXPANDED_EXTRA;

export const sx = {
  appBarSeamless: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    backdropFilter: 'none',
    borderBottom: 'none',
  } as const,
  appBarScrolled: {
    backgroundColor: 'background.paper',
    backdropFilter: 'blur(8px)',
    borderBottom: (t: Theme) => `1px solid ${t.palette.divider}`,
    transition: 'all 0.3s ease-in-out',
  } as const,
  appRoot: (isRailExpanded?: boolean) => ({
    display: 'grid',
    gridTemplateColumns: `${isRailExpanded ? RAIL_EXPANDED_WIDTH : layout.rail.width}px 1fr`,
    gridTemplateRows: `${layout.header.height}px 1fr`,
    gridTemplateAreas: `
      "rail header"
      "rail content"
    `,
    minHeight: '100vh',
    bgcolor: 'background.default',
    transition: 'grid-template-columns 0.3s ease-in-out',
    position: 'relative', // Establish stacking context for fixed children
  }),
  content: {
    gridArea: "content",
    p: { xs: 2, md: 3 },
    paddingTop: `${layout.header.height + 16}px`, // Account for fixed header + extra padding
    minHeight: `calc(100vh - ${layout.header.height}px)`, // Minimum height for full viewport
  } as const,
  coverImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    display: 'block',
  } as const,
  coverViewport: {
    width: sizes.cover.width,
    height: sizes.cover.height,
    bgcolor: 'action.hover',
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  } as const,
  drawerPaper: {
    width: layout.drawer.width,
  } as const,
  headerWrap: (isRailExpanded?: boolean) => ({
    gridArea: 'header',
    position: 'fixed',
    top: 0,
    left: `${isRailExpanded ? RAIL_EXPANDED_WIDTH : layout.rail.width}px`,
    right: 0,
    width: `calc(100% - ${isRailExpanded ? RAIL_EXPANDED_WIDTH : layout.rail.width}px)`,
    zIndex: (t: Theme) => t.zIndex.appBar + 1,
    transition: 'left 0.3s ease-in-out, width 0.3s ease-in-out',
  }),
  modalBody: {
    mt: 2,
    mb: 2,
    overflow: 'auto',
  } as const,
  modalShell: (theme: Theme) => ({
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: sizes.modal.width,
    maxHeight: sizes.modal.maxHeight,
    bgcolor: 'background.paper',
    borderRadius: theme.shape.borderRadius,
    boxShadow: 24,
    p: sizes.modal.padding,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }),
  // Fixed rail positioning
  rail: (isExpanded?: boolean) => ({
    gridArea: 'rail',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: isExpanded ? RAIL_EXPANDED_WIDTH : layout.rail.width,
    display: 'flex',
    alignItems: isExpanded ? 'flex-start' : 'center',
    flexDirection: 'column',
    gap: 1,
    py: 1,
    borderRight: (t: Theme) => `1px solid ${t.palette.divider}`,
    backgroundColor: 'background.paper',
    boxSizing: 'border-box' as const,
    transition: 'width 0.3s ease-in-out',
    overflow: 'hidden',
    zIndex: (t: Theme) => t.zIndex.appBar,
  }),
  // expanded rail wrapper: ensures icons stay in left column
  railItemContainer: (isExpanded?: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    position: 'relative' as const,
    paddingLeft: isExpanded ? '12px' : '0px', // 12px centers the 56px icon in 80px width ((80-56)/2 = 12)
    transition: 'padding-left 0.3s ease-in-out',
  }),
  railIconButton: {
    width: 56,
    height: 56,
    borderRadius: 2,
    flexShrink: 0,
  } as const,
  // label that appears to the right of the icon
  railLabel: (isExpanded?: boolean) => ({
    ml: 1,
    opacity: isExpanded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    visibility: isExpanded ? 'visible' as const : 'hidden' as const,
  }),
};
