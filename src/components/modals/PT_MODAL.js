import React, { useState, useEffect } from "react";

import { Button, Header, Icon, Modal, Image } from "semantic-ui-react";

const PT_MODAL = ({
  trigger,
  type = "normal",
  content,
  actionItems = [],
  size = "small",
  isOpen,
  handleAction
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
        <Button key="cancel" onClick={handleAction} id="cancel" color="red">
          <Icon name="remove" /> Cancel
        </Button>
      );

    actionItems.includes("no") &&
      newArray.push(
        <Button key="no" onClick={handleAction} id="cancel" color="red">
          <Icon name="remove" /> No
        </Button>
      );
    actionItems.includes("nevermind") &&
      newArray.push(
        <Button key="nevermind" onClick={handleAction} id="cancel" color="red">
          <Icon name="remove" /> Nevermind
        </Button>
      );

    actionItems.includes("submit") &&
      newArray.push(
        <Button key="submit" onClick={handleAction} id="submit" color="green">
          <Icon name="checkmark" /> Submit
        </Button>
      );
    actionItems.includes("ok") &&
      newArray.push(
        <Button key="ok" onClick={handleAction} id="submit" color="green">
          <Icon name="checkmark" /> Ok
        </Button>
      );
    actionItems.includes("yes") &&
      newArray.push(
        <Button key="yes" onClick={handleAction} id="submit" color="green">
          <Icon name="checkmark" /> Yes
        </Button>
      );
    setModalActions(newArray);
  };

  const getContent = () => {};

  return (
    <>
      {type === "normal" && (
        <Modal
          trigger={trigger}
          size={size}
          closeIcon={isOpen == null ? true : false}
          open={isOpen}
        >
          <Modal.Header>
            {content && content.modalHeader && content.modalHeader}
          </Modal.Header>
          <Modal.Content image>
            {content && content.image && (
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
              <Header>{content && content.descriptionHeader}</Header>
              {content && content.mainText}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>{modalActions.map(item => item)}</Modal.Actions>
        </Modal>
      )}
      {type === "basic" && (
        <Modal
          trigger={trigger}
          size={size}
          basic
          closeIcon={isOpen == null ? true : false}
          open={isOpen}
        >
          <Modal.Header>
            {content && content.modalHeader && content.modalHeader}
          </Modal.Header>
          <Modal.Content image>
            {content && content.image && (
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
              <Header>{content && content.descriptionHeader}</Header>
              {content && content.mainText}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>{modalActions.map(item => item)}</Modal.Actions>
        </Modal>
      )}
    </>
  );
};

export default PT_MODAL;
