import ModalTitle from '@components/library/ModalTitle';
import { Dialog, DialogContent, DialogActions, Button, Breakpoint } from '@mui/material';

interface CancelModalProps {
  mainText: string;
  isOpen: boolean;
  onCloseModal: () => void;
  onConfirm: () => Promise<void> | void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  maxWidth?: false | Breakpoint | undefined;
}

export const CancelModal = ({
  mainText,
  isOpen,
  onCloseModal,
  onConfirm,
  confirmButtonText,
  cancelButtonText,
  maxWidth,
}: CancelModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onCloseModal} fullWidth maxWidth={maxWidth ?? 'sm'}>
      <ModalTitle onClose={onCloseModal} />
      <DialogContent>{mainText}</DialogContent>
      <DialogActions>
        <Button onClick={onCloseModal} color="primary" variant="outlined">
          {cancelButtonText ?? 'No'}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          {confirmButtonText ?? 'Yes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
