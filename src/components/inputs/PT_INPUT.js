import React from "react";
import { Form } from "semantic-ui-react";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

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
  className,
  disableFuture = true,
  format = "MMM DD, YYYY",
  disabled = false,
  ref,
  maxDate,
  minDate,
  shouldDisableDate,
  openTo
}) => {
  return (
    <>
      {type === "normal" &&
        (valueFromState ? (
          <Form.Input
            disabled={disabled}
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
            disabled={disabled}
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
      {type === "password" &&
        (valueFromState ? (
          <Form.Input
            type="password"
            disabled={disabled}
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
            type="password"
            disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
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
      {type === "date" && (
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            maxDate={maxDate}
            minDate={minDate}
            ref={ref}
            disabled={disabled}
            autoOk
            disableFuture={disableFuture}
            onChange={handleChange}
            value={valueFromState || ""}
            label={label}
            variant="inline"
            format={format}
            margin="normal"
            id={inputId}
            animateYearScrolling
            openTo={openTo}
            shouldDisableDate={shouldDisableDate}
          />
        </MuiPickersUtilsProvider>
      )}
    </>
  );
};

export default PT_INPUT;
