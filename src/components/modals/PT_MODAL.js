import React, { useState, useEffect } from "react";

import { Button, Header, Icon, Modal, Image } from "semantic-ui-react";

const PT_MODAL = ({
  trigger,
  type = "normal",
  content,
  actionItems = [],
  size = "medium"
}) => {
  const [modalActions, setModalActions] = useState([]);

  useEffect(() => {
    makeActionItems();
    getContent();
  }, []);

  const makeActionItems = () => {
    const newArray = [];

    actionItems.includes("cancel") &&
      newArray.push(
        <Button color="red">
          <Icon name="remove" /> Cancel
        </Button>
      );

    actionItems.includes("submit") &&
      newArray.push(
        <Button color="green">
          <Icon name="checkmark" /> Submit
        </Button>
      );
    setModalActions(newArray);
  };

  const getContent = () => {};

  return (
    <>
      {type === "normal" && (
        <Modal trigger={trigger} size={size} closeIcon>
          <Modal.Header>
            {content.modalHeader && content.modalHeader}
          </Modal.Header>
          <Modal.Content image>
            {content.image && (
              <Image
                wrapped
                size={content.image.size ? content.image.size : "medium"}
                src={
                  content.image.src
                    ? content.image.src
                    : "https://react.semantic-ui.com/images/wireframe/image.png"
                }
              />
            )}

            <Modal.Description>
              <Header>{content.descriptionHeader}</Header>
              {content.mainText}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>{modalActions.map(item => item)}</Modal.Actions>
        </Modal>
      )}
      {type === "basic" && (
        <Modal trigger={trigger} size={size} basic closeIcon>
          <Modal.Header>
            {content.modalHeader && content.modalHeader}
          </Modal.Header>
          <Modal.Content image>
            {content.image && (
              <Image
                wrapped
                size={content.image.size ? content.image.size : "medium"}
                src={
                  content.image.src
                    ? content.image.src
                    : "https://react.semantic-ui.com/images/wireframe/image.png"
                }
              />
            )}

            <Modal.Description>
              <Header>{content.descriptionHeader}</Header>
              {content.mainText}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>{modalActions.map(item => item)}</Modal.Actions>
        </Modal>
      )}
    </>
  );
};

export default PT_MODAL;
