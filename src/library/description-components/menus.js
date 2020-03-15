import React from "react";
import {Table } from "semantic-ui-react";
import PT_MENU from "../menus/PT_Menu";

const MenuDescription = ({ history }) => {
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
            <Table.Cell>title</Table.Cell>
            <Table.Cell>string</Table.Cell>
            <Table.Cell>
              (Tabs don't need a Title) This is the title that will show up on
              the Left side of the navbar
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>page</Table.Cell>
            <Table.Cell>string</Table.Cell>
            <Table.Cell>
              match.params accociated with the page that will show then the
              navlink is clicked
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>path</Table.Cell>
            <Table.Cell>string</Table.Cell>
            <Table.Cell>
              Path to start with when routing using navlink
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>links</Table.Cell>
            <Table.Cell>array of strings</Table.Cell>
            <Table.Cell>
              array to build links. Each string will be determine the path and
              title of the link
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>type</Table.Cell>
            <Table.Cell>string</Table.Cell>
            <Table.Cell>
              "tab": Tabular Menu; "navbar": responsive navbar
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>element</Table.Cell>
            <Table.Cell>JSX node</Table.Cell>
            <Table.Cell>
              This will be placed on the right side of the navbar
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <PT_MENU page={"tab"} path={"/dl"} links={["tab"]} type={"tabs"} />

      <pre>
        {`
          <PT_MENU
            title={"Title"}
            page={page}
            path={"/dl"}
            links={pages}
            type={"tabs"}
          />
          `}
      </pre>

      <br />
      <PT_MENU
        title={"Title"}
        page={"tab"}
        path={"/dl"}
        links={["tab", "another tab"]}
        type={"navbar"}
      />

      <pre>
        {`
          <PT_MENU
          title={"Title"}
          page={"tab"}
          path={"/dl"}
          links={["tab", "another tab"]}
          type={"navbar"}
        />
          `}
      </pre>
    </>
  );
};

export default MenuDescription;
