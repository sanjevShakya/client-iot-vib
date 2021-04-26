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
import { Button, Card, CardContent, Typography } from "@material-ui/core";
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
  offset,
  maxVibrationAmplitude,
  tenSecondMaxVibrationAmplitude,
  data,
}) {
  return {
    id,
    name,
    macId,
    isVerified,
    offset,
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

  const {
    devices = [],
    updateDevices = (f) => f,
    handleDelete,
    handleRestart,
  } = props;

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

  const onRestart = (device) => {
    typeof handleRestart === "function" &&
      handleRestart(device)
        .then(() => {
          setConfirmDialogOpen(device, false);
          enqueueSnackbar("Successfully restarted the device");
        })
        .catch((err) => {
          enqueueSnackbar("Error occured while restarting the device", {
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
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h5">
          Mapped Device List
        </Typography>
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
              <TableRow>
                {devicesData.length == 0 && (
                  <TableCell component="td" scope="row">
                    <span style={{ color: "#333" }}>
                      No devices mapped yet!
                    </span>
                  </TableCell>
                )}
              </TableRow>
              {devicesData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    {row.maxVibrationAmplitude}
                  </TableCell>
                  <TableCell align="right">{row.offset}</TableCell>
                  <TableCell align="right">{row.deviceDisplayName}</TableCell>
                  <TableCell align="right">{row.deviceType}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenDialog(row.macId, true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setConfirmDialogOpen(row.macId, true)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => onRestart(row)}
                    >
                      Restart
                    </Button>
                  </TableCell>
                  <ConfirmDialog
                    message={`Do you want to delete mapping for "${row.name}" device?`}
                    handleConfirm={() => onDelete(row)}
                    open={confirmDialogs[row.macId] || false}
                    setOpen={(value) => setConfirmDialogOpen(row.macId, value)}
                  />
                  <UpdateDeviceDialog
                    data={row.data}
                    updateDevices={updateDevices}
                    open={dialogs[row.macId] || false}
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
