import http from "../utils/http";

const endpoint = "/devices";

export const createDevice = (device) => {
  return http.post(endpoint, { body: device });
};

export const fetchDevices = () => {
  return http.get(endpoint).then(({ data }) => data.data);
};

export const fetchDeviceByMetadata = (deviceMetadataName) => {
  return http
    .get(`/devices/metadata/${deviceMetadataName}`)
    .then(({ data }) => data.data);
};

export const updateDevices = (id, device) => {
  return http.put(`${endpoint}/${id}`, { body: device });
};

export const deleteDevice = (device) => {
  return http.remove(`/devices/${device.id}`);
};

export const restartDevice = (device) => {
  return http.post(`/devices/restart/${device.id}`, { body: device });
};

export const calibrateAccelerometer = (device) => {
  return http.post(`/devices/calibrate/${device.id}`, { body: device });
};
