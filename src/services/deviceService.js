import http from "../utils/http";

const endpoint = "/devices";

export const createDevice = (device) => {
  return http.post(endpoint, { body: device });
};

export const fetchDevices = () => {
  return http.get(endpoint).then(({ data }) => data.data);
};

export const updateDevices = (id, device) => {
  return http.put(`${endpoint}/${id}`, { body: device });
};
