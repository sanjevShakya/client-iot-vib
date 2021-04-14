import React from "react";
import {
  Button,
  Checkbox,
  Slider,
  TextField,
  Typography,
  FormGroup,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import * as yup from "yup";
import XDormLaundryMachines from "../common/XDormMachine";

export const validationSchema = yup.object({
  name: yup.string("Enter a device name").required("Device Name is Required"),
  metadataId: yup.string().required("Select a washing machine to map"),
  tolerableSleepDuration: yup
    .number()
    .required("Tolerable sleep duration of machine required"),
  macId: yup.string().required("Device MAC ID is required"),
});

function DeviceForm(props) {
  const { formik } = props;

  return (
    <FormGroup row>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="macId"
          name="macId"
          label="Device MAC ID"
          value={formik.values.macId}
          onChange={formik.handleChange}
          error={formik.touched.macId && Boolean(formik.errors.macId)}
          helperText={formik.touched.macId && formik.errors.macId}
        />
        <TextField
          id="name"
          name="name"
          label="Device Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <Typography id="washine-machine-selector" gutterBottom>
          Washing Machines
        </Typography>
        <XDormLaundryMachines
          name="washing-machine-selector"
          value={formik.values.metadataId}
          handleChange={(value) => formik.setFieldValue("metadataId", value)}
        />
        <TextField
          id="tolerableSleepDuration"
          type="number"
          name="tolerableSleepDuration"
          label="Tolerable Sleep Duration (Seconds)"
          value={formik.values.tolerableSleepDuration}
          onChange={formik.handleChange}
          error={
            formik.touched.tolerableSleepDuration &&
            Boolean(formik.errors.tolerableSleepDuration)
          }
          helperText={
            formik.touched.tolerableSleepDuration &&
            formik.errors.tolerableSleepDuration
          }
        />

        <Typography id="range-slider" gutterBottom>
          Minimum Vibration Amplitude
        </Typography>
        <Slider
          id="minVibrationAmplitude"
          name="minVibrationAmplitude"
          value={formik.values.minVibrationAmplitude}
          onChange={(e, v) => formik.setFieldValue("minVibrationAmplitude", v)}
          valueLabelDisplay="auto"
        />

        <Typography id="range-slider" gutterBottom>
          Maximum Vibration Amplitude
        </Typography>
        <Slider
          id="maxVibrationAmplitude"
          name="maxVibrationAmplitude"
          value={formik.values.maxVibrationAmplitude}
          onChange={(e, v) => formik.setFieldValue("maxVibrationAmplitude", v)}
          valueLabelDisplay="auto"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formik.values.isVerified}
              onChange={formik.handleChange}
              name="isVerified"
              id="isVerified"
              color="primary"
            />
          }
          label="Is verified device?"
        />
      </form>
    </FormGroup>
  );
}

export default DeviceForm;
