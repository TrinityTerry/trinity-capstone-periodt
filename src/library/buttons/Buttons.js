import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";

const PT_Button = ({handleClick, content}) => {
  return <Button onClick={handleClick}>{content}</Button>;
};

export default PT_Button;
