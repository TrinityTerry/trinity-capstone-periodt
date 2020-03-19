import React from "react";

import { Icon } from "semantic-ui-react";

const PT_ICON = ({ name, disabled = false, circular= false, link=false, onClick}) => {


  return <Icon disabled={disabled} circular={circular} onClick={onClick} link={link} name={name} />;
};

export default PT_ICON;
