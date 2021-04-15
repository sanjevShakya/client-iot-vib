import mqtt from "mqtt";
import _get from "lodash.get";
import React, { useEffect, useState } from "react";

export const MqttContext = React.createContext({
  actions: {
    mqttSubscribe: (f) => f,
    mqttPublish: (f) => f,
    mqttDisconnect: (f) => f,
    mqttUnsubscribe: (f) => f,
  },
});

function MqttComponent(props) {
  const [client, setClient] = useState(null);
  const [isClientAvailable, setClientAvailable] = useState(false);
  const [isSubed, setIsSub] = useState({});
  const [payload, setPayload] = useState({});
  const [connectStatus, setConnectStatus] = useState("Connect");

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus("Connecting");
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    mqttConnect("mqtt://127.0.0.1:1884");
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        setClientAvailable(true);
        setConnectStatus("Connected");
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        setClientAvailable(false);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        let receivedMessage = null;
        try {
          receivedMessage = JSON.parse(message.toString());
        } catch (e) {
          receivedMessage = null;
        }
        setPayload(prevState => ({
          ...prevState,
          [topic]: receivedMessage
        }))
        console.log(payload);
      });
    }
  }, [client]);

  const mqttSubscribe = (subscription) => {
    if (client) {
      const { topic, qos = 0 } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.error("subcription error", topic, error);
          return;
        }
        setIsSub({ ...isSubed, [topic]: true });
      });
    }
  };

  const mqttUnsubscribe = (subscription) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, (error) => {
        if (error) {
          return;
        }
        setIsSub({ ...isSubed, [topic]: false });
      });
    }
  };

  const mqttPublish = (context) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
        }
      });
    }
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        setClientAvailable(false);
        setConnectStatus("Connect");
      });
    }
  };

  const getTopicData = (topic) => {
    const value = _get(payload, `${topic}`, null);
    return value;
  };

  return (
    <React.Fragment>
      {props.children({
        payload,
        isClientAvailable,
        getTopicData,
        mqttSubscribe,
        mqttPublish,
        mqttDisconnect,
        mqttUnsubscribe,
      })}
    </React.Fragment>
  );
}

export default function (props) {
  return (
    <MqttComponent>
      {({
        mqttSubscribe,
        mqttPublish,
        getTopicData,
        mqttDisconnect,
        mqttUnsubscribe,
        isClientAvailable,
        payload,
      }) => (
        <MqttContext.Provider
          value={{
            data: {
              isClientAvailable,
              receivedMessages: payload,
            },
            actions: {
              getDataByTopic: getTopicData,
              subscribe: mqttSubscribe,
              publish: mqttPublish,
              disconnect: mqttDisconnect,
              unsubscribe: mqttUnsubscribe,
            },
          }}
        >
          {props.children}
        </MqttContext.Provider>
      )}
    </MqttComponent>
  );
}
