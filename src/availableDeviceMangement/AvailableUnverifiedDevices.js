import _get from "lodash.get";
import React, { useEffect, useState } from "react";
import { MqttContext } from "../MqttProvider";
import topics from "../constants/topics";

import MapDevicesForm from "./MapDevicesForm";
import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CreateDeviceDialog from "../mappedDevices/createDeviceDialog";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const DeviceItem = (props) => {
  const { device, createDevices } = props;
  const [isFormVisible, toggleForm] = useState(false);
  
  return (
    <ListItem>
      <ListItemText primary={device.deviceMACId} />
      <ListItemSecondaryAction>
        <Button
          variant="contained"
          color="primary"
          onClick={() => toggleForm(!isFormVisible)}
        >
          Map Device
        </Button>
      </ListItemSecondaryAction>
      <CreateDeviceDialog
        deviceMacId={device.deviceMACId}
        open={isFormVisible}
        createDevices={createDevices}
        setOpen={(value) => toggleForm(value)}
      />
    </ListItem>
  );
};

const AvailableUnverifiedDevicesUI = (props) => {
  const isClientAvailable = props.isClientAvailable;
  const classes = useStyles();
  const { mqttActions, createDevices } = props;

  useEffect(() => {
    mqttActions.subscribe({ topic: topics.UNVERIFIED_AVAILABLE_DEVICES });
  }, [isClientAvailable]);

  if (!isClientAvailable) {
    return null;
  }
  const data = mqttActions.getDataByTopic(topics.UNVERIFIED_AVAILABLE_DEVICES);
  if (!data) {
    return null;
  }
  const devices = Object.values(data);

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Unverified Device List
        </Typography>
        <List>
          {devices &&
            devices.map((device, index) => (
              <DeviceItem
                device={device}
                key={`unverified_${index}`}
                createDevices={createDevices}
              />
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

function AvailableUnverifiedDevices(props) {
  return (
    <MqttContext.Consumer>
      {({ actions, receivedMessages, data }) => (
        <AvailableUnverifiedDevicesUI
          {...props}
          receivedMessages={receivedMessages}
          isClientAvailable={data.isClientAvailable}
          mqttActions={actions}
        />
      )}
    </MqttContext.Consumer>
  );
}

export default AvailableUnverifiedDevices;
