import React from "react";
import {
  Button,
  Checkbox,
  Slider,
  TextField,
  Typography,
  FormGroup,
  FormControl,
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
          fullWidth
          label="Device MAC ID"
          value={formik.values.macId}
          onChange={formik.handleChange}
          error={formik.touched.macId && Boolean(formik.errors.macId)}
          helperText={formik.touched.macId && formik.errors.macId}
        />
        <TextField
          id="name"
          name="name"
          fullWidth
          label="Device Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <div style={{ padding: "20px 0" }}>
          <Typography
            id="washine-machine-selector"
            variant="caption"
            display="block"
            gutterBottom
          >
            Washing Machines
          </Typography>
          <XDormLaundryMachines
            name="washing-machine-selector"
            value={formik.values.metadataId}
            handleChange={(value) => formik.setFieldValue("metadataId", value)}
          />
        </div>

        <TextField
          id="tolerableSleepDuration"
          type="number"
          fullWidth
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
          Offset
        </Typography>
        <Slider
          id="offset"
          name="offset"
          min={0}
          max={100}
          step={0.1}
          value={formik.values.offset}
          onChange={(e, v) => formik.setFieldValue("offset", v)}
          valueLabelDisplay="auto"
        />

        {/* <Typography id="range-slider" gutterBottom>
          5 Min Max Vibration Amplitude
        </Typography>
        <Slider
          min={0}
          max={100}
          step={0.1}
          id="maxVibrationAmplitude"
          name="maxVibrationAmplitude"
          value={formik.values.maxVibrationAmplitude}
          onChange={(e, v) => formik.setFieldValue("maxVibrationAmplitude", v)}
          valueLabelDisplay="auto"
        /> */}

        <Typography id="range-slider" gutterBottom>
          10 Second Max Vibration Amplitude
        </Typography>
        <Slider
          min={0}
          max={100}
          step={0.1}
          id="tenSecondMaxVibrationAmplitude"
          name="tenSecondMaxVibrationAmplitude"
          value={formik.values.tenSecondMaxVibrationAmplitude}
          onChange={(e, v) =>
            formik.setFieldValue("tenSecondMaxVibrationAmplitude", v)
          }
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
