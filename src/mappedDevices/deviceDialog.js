import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeviceForm from "./deviceForm";

function DeviceDialog(props) {
  const { open, handleClose, formik } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create/Update</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Change device details and parameters
        </DialogContentText>
        <DeviceForm formik={formik} isAddForm={false} />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={formik.handleSubmit}
          variant="contained"
          fullWidth
          type="submit"
        >
          Save
        </Button>
        <Button
          color="default"
          variant="contained"
          onClick={handleClose}
          fullWidth
          type="submit"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeviceDialog;
