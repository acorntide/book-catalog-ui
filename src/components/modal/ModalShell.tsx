/**
 * @file Modal Shell UI
 * Provides a minimal presentational shell for modal content that uses themePrimitives
 */

import { Backdrop, Box, Fade, Modal as MuiModal, Stack, Typography, Divider } from '@mui/material';
import type { ReactNode } from 'react';
import { sx } from '../../themes/themePrimitives';

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  headerActions?: ReactNode;
  children: ReactNode;
};

export default function ModalShell({ open, onClose, title, headerActions, children }: ModalShellProps) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
      aria-labelledby="modal-title"
      aria-describedby="modal-body"
    >
      <Fade in={open}>
        <Box sx={sx.modalShell as any}>
          {/* Header */}
          {(title || headerActions) && (
            <>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography id="modal-title" variant="h6">
                  {title}
                </Typography>
                {headerActions}
              </Stack>
              <Divider sx={{ mt: 1 }} />
            </>
          )}

          {/* Body */}
          <Box id="modal-body" sx={sx.modalBody}>
            {children}
          </Box>
        </Box>
      </Fade>
    </MuiModal>
  );
}
