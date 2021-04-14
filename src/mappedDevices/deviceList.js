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
import { Button, Card, CardContent } from "@material-ui/core";
import UpdateDeviceDialog from "./updateDeviceDialog";
import ConfirmDialog from "../common/confirmDialog";
import { useSnackbar } from "notistack";

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
  tenSecondMaxVibrationAmplitude,
  data,
}) {
  return {
    id,
    name,
    macId,
    isVerified,
    minVibrationAmplitude,
    maxVibrationAmplitude,
    tenSecondMaxVibrationAmplitude,
    deviceType: deviceMetadata.type,
    deviceIcon: deviceMetadata.icon,
    deviceDisplayName: deviceMetadata.name,
    data: data,
  };
}

function DeviceList(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogs, updateDialogs] = useState({});
  const [confirmDialogs, updateConfirmDialogs] = useState({});

  const { devices = [], updateDevices = (f) => f, handleDelete } = props;

  const setOpenDialog = (dialogKey, value) => {
    updateDialogs((prevState) => ({
      ...prevState,
      [dialogKey]: value,
    }));
  };

  const setConfirmDialogOpen = (dialogKey, value) => {
    updateConfirmDialogs((prevState) => ({
      ...prevState,
      [dialogKey]: value,
    }));
  };

  const onDelete = (device) => {
    typeof handleDelete === "function" &&
      handleDelete(device)
        .then(() => {
          setConfirmDialogOpen(device.macId, false);
          enqueueSnackbar("Successfully deleted device mapping");
        })
        .catch((err) => {
          enqueueSnackbar("Error occured while deleting device mapping", {
            type: "error",
          });
        });
  };

  const devicesData = devices.map((device) =>
    createData({
      ...device,
      deviceMetadata: devicesMetadata[device.metadataId],
      data: device,
    })
  );
  return (
    <Card>
      <CardContent>
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
                  <TableCell align="right">
                    {row.maxVibrationAmplitude}
                  </TableCell>
                  <TableCell align="right">
                    {row.minVibrationAmplitude}
                  </TableCell>
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
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setConfirmDialogOpen(row.macId, true)}
                    >
                      Delete Device
                    </Button>
                  </TableCell>
                  <ConfirmDialog
                    message={`Do you want to delete mapping for "${row.name}" device?`}
                    handleConfirm={() => onDelete(row)}
                    open={confirmDialogs[row.macId]}
                    setOpen={(value) => setConfirmDialogOpen(row.macId, value)}
                  />
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
      </CardContent>
    </Card>
  );
}

export default DeviceList;
