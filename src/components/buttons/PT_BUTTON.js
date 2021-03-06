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
  handleMouseEnter,
  handleMouseLeave,
  loading = false,
  compact = false
}) => {
  return (
    <Button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      loading={loading}
      compact={compact}
    />
  );
};

export default PT_BUTTON;
