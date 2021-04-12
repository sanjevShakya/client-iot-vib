import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import WashingMachineIcon from "../assets/icons/washingMachineIcon";
import WashingMachineDryerIcon from "../assets/icons/washinMachineDryerIcon";

const machineTypes = {
  WASHING_MACHINE: "@type/washingmachine",
  DRYER: "@type/dryer",
};

const useStyles = makeStyles({
  parent: {
    display: "flex",
    flexWrap: "wrap",
  },
  child: {
    flex: "1 0 21%;",
    margin: "5px",
    height: "100px",
    border: "1px solid #dfdfdf",
    position: "relative",
  },
  inputCheckbox: {
    position: "absolute",
    width: "100%",
    height: "100%",
    cursor: "pointer",
    opacity: 0,
  },
  selected: {
    background: "#999",
  },
  unselected: {
    background: "#fff",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const machines = {
  washingMachineX1: {
    name: "washingMachineX1",
    displayName: "Washing Machine 1",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: WashingMachineIcon,
  },
  washingMachineX2: {
    name: "washingMachineX2",
    displayName: "Washing Machine 2",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: WashingMachineIcon,
  },
  washingMachineX3: {
    name: "washingMachineX3",
    displayName: "Washing Machine 3",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: WashingMachineIcon,
  },
  washingMachineX4: {
    name: "washingMachineX4",
    displayName: "Washing Machine 4",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: WashingMachineIcon,
  },
  dryerMachineX5: {
    name: "dryerMachineX5",
    displayName: "Dryer Machine 5",
    selected: false,
    type: machineTypes.DRYER,
    icon: WashingMachineDryerIcon,
  },
};

function XDormLaundryMachines(props) {
  const classes = useStyles();
  const [machineCollection, updateMachineCollection] = useState(machines);
  const updateMachineValue = (e, value) => {
    const washingMachineStates = Object.keys(machineCollection).reduce(
      (acc, curr) => {
        const currentMachine = machineCollection[curr];
        acc[curr] = {
          ...currentMachine,
          selected: false,
        };
        if (e.target.name === curr) {
          acc[curr].selected = !acc[curr].selected;
        }
        return acc;
      },
      {}
    );
    updateMachineCollection(washingMachineStates);
    if (value) {
      typeof props.handleChange === "function" &&
        props.handleChange(value.name);
    }
  };
  return (
    <div className={classes.parent}>
      {Object.keys(machineCollection).map((machineKey) => (
        <div
          className={`${classes.child} ${
            machineCollection[machineKey].selected
              ? classes.selected
              : classes.unselected
          }`}
          key={machineKey}
        >
          {machineCollection[machineKey].icon({
            size: 50,
            className: classes.image,
          })}
          <input
            type="checkbox"
            className={classes.inputCheckbox}
            value={machineCollection[machineKey].selected}
            onChange={(e) =>
              updateMachineValue(e, machineCollection[machineKey])
            }
            name={machineCollection[machineKey].name}
          />
        </div>
      ))}
      <div className={classes.child} />
      <div className={classes.child} />
      <div className={classes.child} />
    </div>
  );
}

export default XDormLaundryMachines;
