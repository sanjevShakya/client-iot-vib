import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFormik } from "formik";
import DeviceForm, { validationSchema } from "./deviceForm";

function UpdateDeviceDialog(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const formik = useFormik({
    initialValues: {
      name: "" || props.data.name,
      metadataId: "" || props.data.metadataId,
      isVerified: true || props.data.isVerified,
      tolerableSleepDuration: 60 || Number(props.data.tolerableSleepDuration),
      minVibrationAmplitude: 0 || Number(props.data.minVibrationAmplitude),
      maxVibrationAmplitude: 10 || Number(props.data.maxVibrationAmplitude),
      macId: "" || props.data.macId,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('onsubmit click', values);
      props
        .updateDevices(props.data.id, values)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Update </DialogTitle>
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

export default UpdateDeviceDialog;
