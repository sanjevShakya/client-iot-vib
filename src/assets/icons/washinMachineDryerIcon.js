import React from "react";
import DryerIcon from "./tumble-dryer.svg";

const WashingMachineDryerIcon = ({ size = 512, className } = {}) => (
  <img className={className} src={DryerIcon} height={size} width={size} />
);

export default WashingMachineDryerIcon;
