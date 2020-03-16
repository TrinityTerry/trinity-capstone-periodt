import React, {useState, useEffect} from "react";
import { Table } from "semantic-ui-react";

const PT_TABLE = ({ history, content, headers }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setProperties(Object.getOwnPropertyNames(content[0]))
  }, [])
  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {headers ? headers.map((header) => <Table.HeaderCell key={header}>{header}</Table.HeaderCell>) : Object.getOwnPropertyNames(content[0]).map((property) => <Table.HeaderCell key={property}>{property}</Table.HeaderCell>)}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content.map((item, i) => (
            <Table.Row key={i}>
              {properties.map((property) => <Table.Cell key={property}>{item[property]}</Table.Cell>)}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default PT_TABLE;
