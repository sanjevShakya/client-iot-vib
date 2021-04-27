import React, { useState, useEffect } from "react";

import * as deviceService from "../services/deviceService";
import { dormXMachines } from "../constants/machines";
import WashingMachineIcon from "../assets/icons/washingMachineIcon";
import WashingMachineDryerIcon from "../assets/icons/washinMachineDryerIcon";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@material-ui/core";
import { red, green, yellow, grey } from "@material-ui/core/colors";
import { MqttContext } from "../MqttProvider";

const deviceStates = {
  unavailable: {
    name: "unavailable",
    displayName: "Unavailable",
    color: red[800],
  },
  available: {
    name: "available",
    displayName: "Available",
    color: green[800],
  },
  silent: {
    name: "silent",
    displayName: "Unavailable",
    color: yellow[800],
  },
  unknown: {
    name: "unknown",
    displayName: "Unknown",
    color: grey[800],
  },
};

const deviceOn = "ON";
const deviceOff = "TRUEOFF";
const deviceSilent = "OFF";

const resolveDeviceState = (deviceState) => {
  if (deviceState == deviceOn) {
    return deviceStates.unavailable;
  } else if (deviceState == deviceOff) {
    return deviceStates.available;
  } else if (deviceState == deviceSilent) {
    return deviceStates.silent;
  } else {
    return deviceStates.unknown;
  }
};

function DeviceMqtt(props) {
  return (
    <MqttContext.Consumer>
      {({ actions, data }) => (
        <Device
          {...props}
          mqttActions={actions}
          isClientAvailable={data.isClientAvailable}
          mqttData={data}
        />
      )}
    </MqttContext.Consumer>
  );
}

function DevicesOverview() {
  const [deviceCollection, updateDeviceCollection] = useState(null);

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

  return (
    <div>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {dormXMachines.map((machine) => (
              <Grid key={machine.name} item xs={12} md={3}>
                <DeviceMqtt key={machine.name} deviceMetadata={machine} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

function Device(props) {
  const { deviceMetadata, mqttActions, mqttData, isClientAvailable } = props;
  const [device, updateDevice] = useState(null);
  const [deviceState, updateDeviceState] = useState(null);
  const [isDeviceAvailable, updateDeviceAvailable] = useState(false);
  const [latestData, updateLatestData] = useState({});
  const [topic, setTopic] = useState("");
  const [isMapped, updateIsMapped] = useState(false);

  const data = mqttActions.getDataByTopic(topic);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    // console.log(device);
    if (data) {
      updateLatestData({
        ...data,
        arrivalTime: new Date().toLocaleTimeString(),
      });
      console.log(data);
      updateDeviceState(resolveDeviceState(data.deviceState));
    }
  }, [data]);

  useEffect(() => {
    mqttActions.subscribe({ topic: topic });
  }, [topic]);

  const fetchDevices = () => {
    return deviceService
      .fetchDeviceByMetadata(deviceMetadata.name)
      .then((device) => {
        updateDevice(device);
        updateIsMapped(true);
        const deviceMetadataId = device.metadataId;
        const subscribeUrl = `iot-vib/data/${deviceMetadataId}`;
        mqttActions.subscribe(subscribeUrl);
        setTopic(subscribeUrl);
      })
      .catch((err) => {
        updateIsMapped(false);
      })
      .finally(() => {});
  };

  if (!isMapped) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{deviceMetadata.displayName}</Typography>
          <Typography variant="caption">Device is not Mapped</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{deviceMetadata.displayName}</Typography>
            <Typography variant="caption">Device Registered</Typography>
            <div>
              {deviceState && (
                <Chip
                  label={deviceState.displayName}
                  style={{ background: deviceState.color, color: "#fff" }}
                />
              )}
            </div>
            {latestData && latestData.arrivalTime && (
              <div>
                <Typography variant="caption">Updated at:</Typography>
                <Typography>{latestData.arrivalTime}</Typography>
              </div>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default DevicesOverview;
