import React, { useEffect, useState } from "react";
import MappedDevices from "../mappedDevices/deviceList";
import * as deviceService from "../services/deviceService";
import AvailableUnverifiedDevices from "../availableDeviceMangement/AvailableUnverifiedDevices";
import { Card, CardContent } from "@material-ui/core";
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

  const handleRestart = (device) => {
    return deviceService.restartDevice(device);
  };

  const handleDelete = (device) => {
    return deviceService.deleteDevice(device).then(() => {
      fetchDevices();
    });
  };

  return (
    <Card>
      <CardContent>
        <AvailableUnverifiedDevices createDevices={createDevices} />
        <MappedDevices
          devices={deviceCollection}
          updateDevices={updateDevices}
          handleRestart={handleRestart}
          handleDelete={handleDelete}
        />
        <DevicesChart devices={deviceCollection} />
      </CardContent>
    </Card>
  );
}

export default DeviceManagement;
