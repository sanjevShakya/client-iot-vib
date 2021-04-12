import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { machines as devicesMetadata } from "../constants/machines";
import { Button } from "@material-ui/core";
import UpdateDeviceDialog from "./updateDeviceDialog";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData({
  id,
  name,
  macId,
  isVerified,
  deviceMetadata,
  minVibrationAmplitude,
  maxVibrationAmplitude,
  data,
}) {
  return {
    id,
    name,
    macId,
    isVerified,
    minVibrationAmplitude,
    maxVibrationAmplitude,
    deviceType: deviceMetadata.type,
    deviceIcon: deviceMetadata.icon,
    deviceDisplayName: deviceMetadata.name,
    data: data,
  };
}

function DeviceList(props) {
  const classes = useStyles();
  const [dialogs, updateDialogs] = useState({});
  const { devices = [], updateDevices = (f) => f } = props;

  const setOpenDialog = (dialogKey, value) => {
    updateDialogs((prevState) => ({
      ...prevState,
      [dialogKey]: value,
    }));
  };

  console.log(devices);
  console.log(devicesMetadata);
  const devicesData = devices.map((device) =>
    createData({
      ...device,
      deviceMetadata: devicesMetadata[device.metadataId],
      data: device,
    })
  );
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Device Name</TableCell>
            <TableCell align="right">Max Vibration Threshold</TableCell>
            <TableCell align="right">Min Vibration Threshold</TableCell>
            <TableCell align="right">Device Name</TableCell>
            <TableCell align="right">Device Type</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devicesData.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.maxVibrationAmplitude}</TableCell>
              <TableCell align="right">{row.minVibrationAmplitude}</TableCell>
              <TableCell align="right">{row.deviceDisplayName}</TableCell>
              <TableCell align="right">{row.deviceType}</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenDialog(row.macId, true)}
                >
                  Edit Device
                </Button>
              </TableCell>
              <UpdateDeviceDialog
                data={row.data}
                updateDevices={updateDevices}
                open={dialogs[row.macId]}
                setOpen={(value) => setOpenDialog(row.macId, value)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DeviceList;
