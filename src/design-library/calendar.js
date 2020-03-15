import React from "react";
import { Table } from "semantic-ui-react";
import PT_CALENDAR from "../components/calendar/PT_CALENDAR";

const CalendarDescription = ({ history }) => {
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
            <Table.Cell>date</Table.Cell>
            <Table.Cell>string</Table.Cell>
            <Table.Cell>"YYYY-MM" TO determine what month to create</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>highlight</Table.Cell>
            <Table.Cell>array of strings</Table.Cell>
            <Table.Cell>
              Takes a string of numbers and those corrosponding days will be
              hilighted
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <pre>
        {`
          <PT_CALENDAR date={"2020-03"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-03"} highlight={["9", "10", "11"]} />

      <br />

      <pre>
        {`
          <PT_CALENDAR date={"2020-02"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-02"} highlight={["9", "10", "11"]} />
      
      <br />

      <pre>
        {`
          <PT_CALENDAR date={"2020-05"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-05"} highlight={["9", "10", "11"]} />
      
      <br />

      <pre>
        {`
          <PT_CALENDAR date={"2020-06"} highlight={["9", "10", "11"]}/>
          `}
      </pre>
      <PT_CALENDAR date={"2020-06"} highlight={["9", "10", "11"]} />
    </>
  );
};

export default CalendarDescription;
