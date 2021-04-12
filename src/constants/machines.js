
export const machineTypes = {
  WASHING_MACHINE: "@type/washingmachine",
  DRYER: "@type/dryer",
};

export const machines = {
  washingMachineX1: {
    name: "washingMachineX1",
    displayName: "Washing Machine 1",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: 'washingMachineIcon',
  },
  washingMachineX2: {
    name: "washingMachineX2",
    displayName: "Washing Machine 2",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: 'washingMachine'
  },
  washingMachineX3: {
    name: "washingMachineX3",
    displayName: "Washing Machine 3",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: 'washingMachine'
  },
  washingMachineX4: {
    name: "washingMachineX4",
    displayName: "Washing Machine 4",
    checked: false,
    type: machineTypes.WASHING_MACHINE,
    icon: 'washingMachine'
  },
  dryerMachineX5: {
    name: "dryerMachineX5",
    displayName: "Dryer Machine 5",
    selected: false,
    type: machineTypes.DRYER,
    icon: 'dryerMachine',
  },
};
