import React from "react";
import { Card, Popup, Dimmer, Loader, Image, Segment } from "semantic-ui-react";

const PT_LOADER = ({ active }) => {
  return (
    <Dimmer active={active}>
      <Loader />
    </Dimmer>
  );
};
export default PT_LOADER;
