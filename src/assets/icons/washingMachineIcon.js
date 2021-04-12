import React from "react";
import WashingMachiceSVG from './washing-machine.svg'

const WashingMachineIcon = ({ className = "", size = 512 } = {}) => (
  <img className={className} src={WashingMachiceSVG} height={size} width={size} />
);

export default WashingMachineIcon;
