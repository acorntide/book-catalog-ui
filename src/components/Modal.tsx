import { Backdrop, Box, Button, Fade, Modal as MuiModal, Stack, TextField, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function Modal({ open, handleClose }: ModalProps) {
    return (
        <div>
            <MuiModal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{
                    backdrop: Backdrop
                }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Modal Title
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems={"flex-start"}
                            justifyContent="space-between"
                            sx={{
                                mb: 4
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <img
                                    src={`${import.meta.env.BASE_URL}static/images/everyone-poops.jpg`}
                                    alt="everyone poops"
                                    style={{ border: '1px solid #ccc', borderRadius: 4, boxShadow: '24' }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                <TextField label="ISBN" fullWidth />
                                <TextField label="Title" fullWidth />
                                <TextField label="Author" fullWidth />
                                <TextField label="Description" fullWidth multiline rows={4} />
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="text" color="secondary" sx={{ mt: 3 }} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleClose}>
                                Save
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </MuiModal>
        </div>
    );
}