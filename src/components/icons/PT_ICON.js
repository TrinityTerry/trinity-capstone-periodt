import React from "react";

import { Icon } from "semantic-ui-react";

const PT_ICON = ({
  floated,
  size = "large",
  name,
  disabled = false,
  value,
  circular = false,
  link = false,
  onClick
}) => {
  return (
    <Icon
      size={size}
      floated={floated}
      disabled={disabled}
      value={value}
      circular={circular}
      onClick={onClick}
      link={link}
      name={name}
    />
  );
};

export default PT_ICON;
