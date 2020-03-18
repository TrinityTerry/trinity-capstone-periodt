import React from "react";

import { Button } from "semantic-ui-react";

const PT_BUTTON = ({ handleClick, content, basic = false, buttonClass, inverted = false, icon, iconPosition, size, circular= false}) => {


  return <Button content={content} basic={basic} className={buttonClass} circular={circular} inverted={inverted} size={size} onClick={handleClick} icon={icon} labelPosition={iconPosition}/>;
};

export default PT_BUTTON;
