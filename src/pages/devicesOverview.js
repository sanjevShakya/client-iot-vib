import React, { useState, useEffect } from "react";

import * as deviceService from "../services/deviceService";
import { dormXMachines } from "../constants/machines";
import { Card, CardContent } from "@material-ui/core";
import MqttProvider, { MqttContext } from "../MqttProvider";

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

  return (
    <div>
      <Card>
        <CardContent>
          {dormXMachines.map((machine) => (
            <DeviceMqtt key={machine.name} deviceMetadata={machine} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DeviceStatus(props) {
  return <div>Device Status</div>;
}

function Device(props) {
  const { deviceMetadata, mqttActions, mqttData, isClientAvailable } = props;
  const [device, updateDevice] = useState({});
  const [topic, setTopic] = useState("");
  const [isMapped, updateIsMapped] = useState(false);

  const data = mqttActions.getDataByTopic(topic);

  useEffect(() => {
    if (topic && isMapped) {
      mqttActions.subscribe({ topic: topic });
    }
  }, [isClientAvailable, topic, isMapped]);

  useEffect(() => {
    fetchDevices();
  }, []);

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

  return (
    <div>
      <h3>{deviceMetadata.displayName}</h3>
      <span>{isMapped ? "Mapped" : "Not Mapped"}</span>
      <DeviceStatus device={device} />
    </div>
  );
}

export default DevicesOverview;
