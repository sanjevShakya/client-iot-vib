import { Card, CardContent } from "@material-ui/core";
import { useFormik } from "formik";
import React from "react";
import DeviceForm, { validationSchema } from "../mappedDevices/deviceForm";

function MapDevicesFormUi(props) {
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
          console.log(data);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  return (
    <Card>
      <CardContent>
        <DeviceForm formik={formik} />
      </CardContent>
    </Card>
  );
}

export default MapDevicesFormUi;
