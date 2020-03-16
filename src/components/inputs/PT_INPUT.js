import React from "react";
import { Input, TextArea, Form } from "semantic-ui-react";

const PT_INPUT = ({
  placeholder,
  inputId,
  error = false,
  icon,
  type = "normal",
  handleChange,
  value,
  valueFromState = false
}) => {
  return (
    <>
      {type === "normal" &&
        (valueFromState ? (
          <Form.Input
            error={error}
            id={inputId}
            value={valueFromState}
            onChange={handleChange}
            placeholder={placeholder}
            icon={icon}
          />
        ) : (
          <Form.Input
            error={error}
            id={inputId}
            onChange={handleChange}
            placeholder={placeholder}
            icon={icon}
          />
        ))}
      {type === "textarea" &&
        (valueFromState ? (
          <>
              <Form.TextArea
                value={valueFromState}
                id={inputId}
                onChange={handleChange}
                placeholder={placeholder}
              />
          </>
        ) : (
          <>
              <Form.TextArea
                id={inputId}
                onChange={handleChange}
                placeholder={placeholder}
              />
          </>
        ))}
    </>
  );
};

export default PT_INPUT;
