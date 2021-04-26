import http from "../utils/http";

const endpoint = "/notification";

export const subscribePushNotificatio = (data) => {
  return http.post("/subscribe-notification", { body: data });
};
