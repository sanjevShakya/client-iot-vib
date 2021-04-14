import React, { useEffect, useState } from "react";
import MappedDevices from "../mappedDevices/deviceList";
import * as deviceService from "../services/deviceService";
import AvailableUnverifiedDevices from "../availableDeviceMangement/AvailableUnverifiedDevices";
import { Card } from "@material-ui/core";
import DevicesChart from "../deviceDataVisuals/devicesChart";

function DeviceManagement() {
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
    <Card>
      <AvailableUnverifiedDevices createDevices={createDevices} />
      <MappedDevices devices={deviceCollection} updateDevices={updateDevices} />
      <DevicesChart devices={deviceCollection} />
    </Card>
  );
}

export default DeviceManagement;
