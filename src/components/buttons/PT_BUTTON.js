import React from "react";

import { Button } from "semantic-ui-react";

const PT_BUTTON = ({ handleClick, content, basic = false, inverted = false, icon, iconPosition}) => {


  return <Button content={content} basic={basic} inverted={inverted} onClick={handleClick} icon={icon} labelPosition={iconPosition}/>;
};

export default PT_BUTTON;
