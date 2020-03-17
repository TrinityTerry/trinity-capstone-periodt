import React from "react";
import { Form } from "semantic-ui-react";

const PT_INPUT = ({
  placeholder,
  inputId,
  error = false,
  icon,
  type = "normal",
  handleChange,
  value,
  valueFromState = false,
  label
}) => {
  return (
    <>
      {type === "normal" &&
        (valueFromState ? (
          <Form.Field>
            <label>{label}</label>
            <Form.Input
              error={error}
              id={inputId}
              value={valueFromState}
              onChange={handleChange}
              placeholder={placeholder}
              icon={icon}
            />
          </Form.Field>
        ) : (
          <Form.Field>
            <label>{label}</label>
            <Form.Input
              error={error}
              id={inputId}
              onChange={handleChange}
              placeholder={placeholder}
              icon={icon}
            />
          </Form.Field>
        ))}
      {type === "textarea" &&
        (valueFromState ? (
          <>
            <Form.Field>
              <label>{label}</label>
              <Form.TextArea
                value={valueFromState}
                id={inputId}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </Form.Field>
          </>
        ) : (
          <>
            <Form.Field>
              <label>{label}</label>
              <Form.TextArea
                id={inputId}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </Form.Field>
          </>
        ))}
    </>
  );
};

export default PT_INPUT;
