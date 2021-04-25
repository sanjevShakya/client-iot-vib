import React, { useEffect, useState } from "react";
import { MqttContext } from "../MqttProvider";
import { Line } from "@reactchartjs/react-chart.js";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";

const chartOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const transformChartData = (coordinateList, label) => {
  let xCoordinates = coordinateList.map((coordinate) => coordinate[0]);
  let yCoordinates = coordinateList.map((coordinate) => coordinate[1]);
  return {
    labels: xCoordinates,
    datasets: [
      {
        label: label,
        data: yCoordinates,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };
};

function LineChart(props) {
  const { data, label } = props;
  const chartData = transformChartData(data, label);
  return <Line data={chartData} options={chartOptions} />;
}

function getDeviceTimeData(deviceData) {
  let time = new Date().toLocaleTimeString();
  return {
    ax: [time, deviceData.ax],
    ay: [time, deviceData.ay],
    az: [time, deviceData.az],
    mean: [time, deviceData.mean],
  };
}

function DeviceChart(props) {
  const { device, isClientAvailable, mqttActions } = props;
  const [topic, setTopic] = useState("");
  const [deviceMeanTimeData, updateMeanDeviceTimeData] = useState([]);
  const [deviceAxTimeData, updateAxTimeData] = useState([]);
  const [deviceAyTimeData, updateAyTimeData] = useState([]);
  const [deviceAzTimeData, updateAzTimeData] = useState([]);

  const data = mqttActions.getDataByTopic(topic);

  useEffect(() => {
    if (data) {
      const { ax, ay, az, mean } = getDeviceTimeData(data);
      updateMeanDeviceTimeData(deviceMeanTimeData.concat([mean]));
      updateAxTimeData(deviceAxTimeData.concat([ax]));
      updateAyTimeData(deviceAyTimeData.concat([ay]));
      updateAzTimeData(deviceAzTimeData.concat([az]));
    }
  }, [data]);

  useEffect(() => {
    const deviceTopic = `iot-vib/data/${device.metadataId}`;
    setTopic(deviceTopic);
  }, []);

  useEffect(() => {
    if (topic) {
      mqttActions.subscribe({ topic: topic });
    }
  }, [isClientAvailable, topic]);

  return (
    <Card>
      <CardActionArea>
        <Typography>{device.name}</Typography>
        <Typography>{device.offset}</Typography>
        <Typography>{device.maxVibrationAmplitude}</Typography>
        <Typography>{device.macId}</Typography>
      </CardActionArea>
      <CardContent>
        <Grid container>
          {deviceAxTimeData.length > 0 && (
            <Grid item xs={12} md={6}>
              <LineChart label="mean" data={deviceMeanTimeData} />
            </Grid>
          )}
          {deviceAxTimeData.length > 0 && (
            <Grid item xs={12} md={6}>
              <LineChart label="ax" data={deviceAxTimeData} />
            </Grid>
          )}
          {deviceAyTimeData.length > 0 && (
            <Grid item xs={12} md={6}>
              <LineChart label="ay" data={deviceAyTimeData} />
            </Grid>
          )}
          {deviceAzTimeData.length > 0 && (
            <Grid item xs={12} md={6}>
              <LineChart label="az" data={deviceAzTimeData} />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

function DeviceChartMqtt(props) {
  return (
    <MqttContext.Consumer>
      {({ actions, data }) => (
        <DeviceChart
          {...props}
          isClientAvailable={data.isClientAvailable}
          mqttData={data}
          mqttActions={actions}
        />
      )}
    </MqttContext.Consumer>
  );
}

function DevicesChart(props) {
  const { devices } = props;
  return (
    <div>
      <Typography>Device Charts</Typography>
      {devices &&
        devices.length > 0 &&
        devices.map((device) => (
          <DeviceChartMqtt key={device.name} device={device} />
        ))}
    </div>
  );
}

export default DevicesChart;
