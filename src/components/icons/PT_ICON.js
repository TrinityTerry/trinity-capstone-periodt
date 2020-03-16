import React from "react";

import { Icon } from "semantic-ui-react";

const PT_ICON = ({ name, disabled = false }) => {


  return <Icon disabled={disabled} name={name} />;
};

export default PT_ICON;
