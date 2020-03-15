import React from "react";

import { Button } from "semantic-ui-react";

const PT_Button = ({ handleClick, content }) => {
  return <Button content={content} onClick={handleClick} />;
};

export default PT_Button;
