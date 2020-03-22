import React from "react";
import { Form } from "semantic-ui-react";

const PT_INPUT = ({
  placeholder,
  inputId,
  error = false,
  icon,
  type = "normal",
  handleChange,
  name,
  valueFromState = false,
  label,
  className
}) => {
  return (
    <>
      {type === "normal" &&
        (valueFromState ? (
          <Form.Input
            label={label}
            error={error}
            id={inputId}
            name={name}
            value={valueFromState || ""}
            onChange={handleChange}
            placeholder={placeholder}
            icon={icon}
            className={className}
          />
        ) : (
          <Form.Input
            label={label}
            name={name}
            error={error}
            id={inputId}
            onChange={handleChange}
            placeholder={placeholder}
            icon={icon}
            className={className}
          />
        ))}
      {type === "textarea" &&
        (valueFromState ? (
          <>
          <Form>
            <Form.TextArea
              label={label}
              name={name}
              value={valueFromState || ""}
              id={inputId}
              onChange={handleChange}
              placeholder={placeholder}
              className={className}
            />
            </Form>
          </>
        ) : (
          <>
          <Form>
            <Form.TextArea
              label={label}
              id={inputId}
              name={name}
              onChange={handleChange}
              placeholder={placeholder}
              className={className}
            />
            </Form>
          </>
        ))}
    </>
  );
};

export default PT_INPUT;
