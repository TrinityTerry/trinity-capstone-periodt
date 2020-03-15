import React, {useState, useEffect} from "react";
import { Table } from "semantic-ui-react";

const PT_TABLE = ({ history, content }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setProperties(Object.getOwnPropertyNames(content[0]))
  }, [])
  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {Object.getOwnPropertyNames(content[0]).map((property) => <Table.HeaderCell key={property}>{property}</Table.HeaderCell>)}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content.map(item => (
            <Table.Row>
              {properties.map((property) => <Table.Cell>{item[property]}</Table.Cell>)}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default PT_TABLE;