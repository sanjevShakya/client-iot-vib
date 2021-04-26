/**
 * Application wide configuration.
 */
const config = {
  env: process.env.NODE_ENV,
  appVersion: process.env.REACT_APP_VERSION,
  baseURI: process.env.REACT_APP_API_BASE_URI,
  mqttPort: process.env.REACT_APP_MQTT_PORT,
  mqttHost: process.env.REACT_APP_MQTT_HOST,
  publicVapidKey: process.env.REACT_APP_PUBLIC_VAPID_KEY,
};

export default config;
