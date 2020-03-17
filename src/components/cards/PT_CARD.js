import React from "react";

import { Card } from "semantic-ui-react";

const PT_CARD = ({ cardArray = [], itemsPerRow, groupClass}) => {
  const src = "https://react.semantic-ui.com/images/wireframe/white-image.png";
  return <Card.Group className={groupClass} itemsPerRow={itemsPerRow} stackable items={cardArray} />;
};

export default PT_CARD;
