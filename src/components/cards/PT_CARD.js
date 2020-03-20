import React from "react";

import { Card } from "semantic-ui-react";

const PT_CARD = ({ cardArray = [], itemsPerRow, groupClass, indiv = true, description, extra, header, image, meta }) => {
  const src = "https://react.semantic-ui.com/images/wireframe/white-image.png";
  return (
    <>
      {indiv ? (
        <Card
          className={groupClass}
          content={cardArray}
          description={description}
          extra={extra}
          header={header}
          image={image}
          meta={meta}
        />
      ) : (
        <Card.Group
          className={groupClass}
          itemsPerRow={itemsPerRow}
          stackable
          items={cardArray}
        />
      )}
    </>
  );
};

export default PT_CARD;
