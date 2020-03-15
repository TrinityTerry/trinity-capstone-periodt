import React from "react";
import { Table } from "semantic-ui-react";
import PT_BUTTONS from "../components/buttons/PT_BUTTONS";

const ButtonDescription = ({ history }) => {
  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Prop Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>handleClick</Table.Cell>
            <Table.Cell>function</Table.Cell>
            <Table.Cell>Function that will run on click.</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>content</Table.Cell>
            <Table.Cell>string</Table.Cell>
            <Table.Cell>text that will show on the button</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <PT_BUTTONS handleClick={""} content={"button example"} />

      <pre>
        {`
          <PT_BUTTONS content={"button example"}/>
          `}
      </pre>
    </>
  );
};

export default ButtonDescription;
