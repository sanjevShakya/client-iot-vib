import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import DeviceDialog from "./deviceDialog";
import { validationSchema } from "./deviceForm";

function UpdateDeviceDialog(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: "" || props.data.name,
      metadataId: "" || props.data.metadataId,
      isVerified: true || props.data.isVerified,
      tolerableSleepDuration: Number(props.data.tolerableSleepDuration),
      offset: Number(props.data.offset),
      maxVibrationAmplitude: Number(props.data.maxVibrationAmplitude),
      tenSecondMaxVibrationAmplitude: Number(
        props.data.tenSecondMaxVibrationAmplitude
      ),
      macId: "" || props.data.macId,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      props
        .updateDevices(props.data.id, values)
        .then((data) => {
          handleClose();
          enqueueSnackbar("Sucessfully updated device config.", {
            variant: "success",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  return <DeviceDialog formik={formik} handleClose={handleClose} open={open} />;
}

export default UpdateDeviceDialog;
