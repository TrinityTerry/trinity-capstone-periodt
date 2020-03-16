import React from "react";

import { Icon } from "semantic-ui-react";

const PT_ICON = ({ name, disabled = false, circular= false, link=false }) => {


  return <Icon disabled={disabled} circular={circular} link={link} name={name} />;
};

export default PT_ICON;
