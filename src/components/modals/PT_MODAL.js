import React, { useState, useEffect } from "react";

import { Button, Header, Icon, Modal, Image } from "semantic-ui-react";

const PT_MODAL = ({
  trigger,
  type = "normal",
  content,
  actionItems = [],
  size = "small",
  isOpen,
  handleAction,
  currentCycle,
  closeIcon = false
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
        <Button
          key="cancel"
          onClick={handleAction}
          icon="remove"
          name="cancel"
          content="Cancel"
          color="red"
        />
      );
    actionItems.includes("delete") &&
      newArray.push(
        <Button
          key="cancel"
          value="delete"
          onClick={handleAction}
          icon="remove"
          name="cancel"
          content="Delete"
          color="red"
        />
      );

    actionItems.includes("no") &&
      newArray.push(
        <Button
          key="no"
          onClick={handleAction}
          name="cancel"
          icon="remove"
          content="No"
          color="red"
        />
      );
    actionItems.includes("nevermind") &&
      newArray.push(
        <Button
          key="nevermind"
          onClick={handleAction}
          icon="remove"
          content="Nevermind"
          name="cancel"
          color="red"
        />
      );

    actionItems.includes("submit") &&
      newArray.push(
        <Button
          key="submit"
          onClick={handleAction}
          icon="checkmark"
          content="Submit"
          name="submit"
          color="green"
        />
      );
    actionItems.includes("ok") &&
      newArray.push(
        <Button
          key="ok"
          onClick={handleAction}
          icon="checkmark"
          content="Ok"
          name="submit"
          color="green"
        />
      );
    actionItems.includes("yes") &&
      newArray.push(
        <Button
          key="yes"
          onClick={handleAction}
          name="submit"
          content="Yes"
          icon="checkmark"
          color="green"
        />
      );
    actionItems.includes("edit") &&
      newArray.push(
        <Button
          key="yes"
          onClick={handleAction}
          name="submit"
          content="Edit"
          icon="checkmark"
          color="green"
        />
      );
    actionItems.includes("save") &&
      newArray.push(
        <Button
          key="yes"
          onClick={handleAction}
          icon="checkmark"
          value="submit"
          name="submit"
          content="Save"
          color="green"
        />
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
          closeIcon={closeIcon}
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
          closeIcon={isOpen === null ? true : false}
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
