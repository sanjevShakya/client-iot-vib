import React, { useEffect, useState } from "react";
import * as deviceService from "../services/deviceService";
import { MqttContext } from "../MqttProvider";
import { Line } from "@reactchartjs/react-chart.js";
import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";

const chartOptions = {
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Time",
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Resultant Amplitude",
        },
        ticks: {
          text: "test-axis",
          beginAtZero: true,
        },
      },
    ],
  },
};

const transformChartData = (coordinateList, label, maxVibration) => {
  let xCoordinates = coordinateList.map((coordinate) => coordinate[0]);
  let yCoordinates = coordinateList.map((coordinate) => coordinate[1]);
  return {
    labels: xCoordinates,
    datasets: [
      {
        type: "line",
        label: "Upper Limit",
        data: maxVibration,
        fill: false,
        backgroundColor: "rgb(55, 55, 55)",
        borderColor: "rgba(55, 55, 55, 0.2)",
      },
      {
        type: "bar",
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
  const { data, label, maxVibration } = props;
  const chartData = transformChartData(data, label, maxVibration);
  return <Line data={chartData} options={chartOptions} />;
}

function getDeviceTimeData(deviceData) {
  let time = new Date().toLocaleTimeString();
  return {
    ax: [time, deviceData.ax],
    ay: [time, deviceData.ay],
    az: [time, deviceData.az],
    mean: [time, deviceData.comparedMean],
  };
}

const DATA_LIMIT = 1000;

function DeviceChart(props) {
  const { device, isClientAvailable, mqttActions } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [topic, setTopic] = useState("");
  const [deviceMeanTimeData, updateMeanDeviceTimeData] = useState([]);
  const [maxVibrationTimeData, updateMaxVibrationTimeData] = useState([]);
  const [deviceAxTimeData, updateAxTimeData] = useState([]);
  const [deviceAyTimeData, updateAyTimeData] = useState([]);
  const [deviceAzTimeData, updateAzTimeData] = useState([]);
  const data = mqttActions.getDataByTopic(topic);

  useEffect(() => {
    if (data) {
      const { ax, ay, az, mean } = getDeviceTimeData(data);
      if (deviceMeanTimeData.length > DATA_LIMIT) {
        maxVibrationTimeData.shift();
        deviceMeanTimeData.shift();
        deviceAxTimeData.shift();
        deviceAyTimeData.shift();
        deviceAzTimeData.shift();
      }
      updateMeanDeviceTimeData(deviceMeanTimeData.concat([mean]));
      updateMaxVibrationTimeData(
        maxVibrationTimeData.concat([Number(device.tenSecondMaxVibrationAmplitude || 0)])
      );
      updateAxTimeData(deviceAxTimeData.concat([ax]));
      updateAyTimeData(deviceAyTimeData.concat([ay]));
      updateAzTimeData(deviceAzTimeData.concat([az]));
    }
  }, [data]);

  useEffect(() => {
    const deviceTopic = `iot-vib/data/${device.metadataId}`;
    setTopic(deviceTopic);
  }, []);

  const clearGraph = () => {
    updateMeanDeviceTimeData([]);
    updateMaxVibrationTimeData([]);
    updateAxTimeData([]);
    updateAyTimeData([]);
    updateAzTimeData([]);
  };

  const calibrateAccelerometer = () => {
    deviceService
      .calibrateAccelerometer(device)
      .then(() => {
        enqueueSnackbar("Calibration for device started", {
          variant: "success",
        });
      })
      .catch((err) => {
        enqueueSnackbar("Cannot calibrate the device", {
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (topic) {
      mqttActions.subscribe({ topic: topic });
    }
  }, [isClientAvailable, topic]);

  return (
    <Card style={{ margin: 16, padding: 16 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">{device.name}</Typography>
            <Typography variant="overline">{device.macId}</Typography>
            <Typography variant="caption">Offset:</Typography>
            <Typography>{device.offset}</Typography>
            <Typography variant="caption">Ten Second Max Amplitude:</Typography>
            <Typography gutterBottom>{device.tenSecondMaxVibrationAmplitude}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  color="primary"
                  onClick={clearGraph}
                  variant="contained"
                  fullWidth
                  disabled={deviceAxTimeData.length === 0}
                >
                  Clear Graph
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  color="secondary"
                  onClick={calibrateAccelerometer}
                  variant="contained"
                  fullWidth
                >
                  Calibrate Accelerometer
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {deviceAxTimeData.length > 0 && (
            <Grid item xs={12} md={8}>
              <LineChart
                label="mean"
                data={deviceMeanTimeData}
                maxVibration={maxVibrationTimeData}
              />
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
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h5">
          Device Status/Chart
        </Typography>
        {devices &&
          devices.length > 0 &&
          devices.map((device) => (
            <DeviceChartMqtt key={device.name} device={device} />
          ))}
      </CardContent>
    </Card>
  );
}

export default DevicesChart;
