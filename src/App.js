import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import MappedDevices from "./mappedDevices/deviceList";
import * as deviceService from "./services/deviceService";
import AvailableUnverifiedDevices from "./availableDeviceMangement/AvailableUnverifiedDevices";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      st121495 - Sanjeev Shakya {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Album() {
  const classes = useStyles();
  const [deviceCollection, updateDeviceCollection] = useState([]);
  useEffect(() => {
    fetchDevices();
  }, []);
  const fetchDevices = () => {
    return deviceService
      .fetchDevices()
      .then((devices) => {
        updateDeviceCollection(devices);
      })
      .finally(() => {});
  };
  const updateDevices = (deviceId, device) => {
    console.log(device);
    return deviceService
      .updateDevices(deviceId, device)
      .then((device) => {
        fetchDevices();
      })
      .catch((err) => {})
      .finally(() => {});
  };
  const createDevices = (device) => {
    return deviceService
      .createDevice(device)
      .then(() => {
        fetchDevices();
      })
      .catch((err) => {})
      .finally(() => {});
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Laundry Notification Service
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <AvailableUnverifiedDevices createDevices={createDevices} />
        <MappedDevices
          devices={deviceCollection}
          updateDevices={updateDevices}
        />
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Laundry Monitoring System
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
