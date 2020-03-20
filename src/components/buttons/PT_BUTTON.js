import React from "react";

import { Button } from "semantic-ui-react";

const PT_BUTTON = ({
  disabled,
  active,
  handleClick,
  value,
  name,
  content,
  basic = false,
  buttonClass,
  inverted = false,
  icon,
  iconPosition,
  size,
  circular = false,
  id,
}) => {
  return (
    <Button
      active={active}
      disabled={disabled}
      content={content}
      name={name}
      basic={basic}
      className={buttonClass}
      circular={circular}
      inverted={inverted}
      size={size}
      onClick={handleClick}
      icon={icon}
      labelPosition={iconPosition}
      value={value}
      id={id}
    />
  );
};

export default PT_BUTTON;
