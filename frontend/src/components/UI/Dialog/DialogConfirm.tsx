import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  DialogTitle,
} from "@material-ui/core";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  contextText: string;
  title: string;
  confirmBtnColor: "inherit" | "default" | "primary" | "secondary" | undefined;
}

const DialogBox = ({
  open,
  onCancel,
  onConfirm,
  contextText,
  confirmText,
  title,
  confirmBtnColor,
}: Props) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contextText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color={confirmBtnColor} autoFocus>
          {confirmText}
        </Button>
        <Button onClick={onCancel} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
