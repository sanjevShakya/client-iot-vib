import React from "react";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import DeviceDialog from './deviceDialog';
import { validationSchema } from "./deviceForm";

function CreateDeviceDialog(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: "",
      metadataId: "",
      isVerified: true,
      tolerableSleepDuration: 60,
      minVibrationAmplitude: 0,
      maxVibrationAmplitude: 10,
      tenSecondMaxVibrationAmplitude: 8,
      macId: props.deviceMacId || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      props
        .createDevices(values)
        .then((data) => {
          handleClose();
          enqueueSnackbar("Sucessfully created device config.", {
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

export default CreateDeviceDialog;
