import React from "react";
import PT_TABLE from "../components/tables/PT_TABLE";

const TableDescription = ({ history }) => {
  return (
    <>

      <PT_TABLE
        content={[
          {
            property: "content",
            type: "array of objects",
            description:
              "This will take the properties of the object to create the headers, then the rows will be build based on the values of each key value pair."
          },
          {
            property: "headers",
            type: "array of objects [optional]",
            description:
              "This will rename the headers. If no headers are defined, the property name of the first array in the contenr header will be the header values."
          }
        ]}
        headers={["Property", "Type", "Description"]}
      />
      <hr />
      <h2>With Header Property</h2>
      <pre>
        {`
          <PT_TABLE
          content={[
            {
              property: "content",
              type: "more content",
              description: "some content"
            }
          ]}
          headers={["Column1", "Column2", "Column3"]}
        />
          `}
      </pre>
      <PT_TABLE
        content={[
          {
            property: "content",
            type: "more content",
            description: "some content"
          }
        ]}
        headers={["Column1", "Column2", "Column3"]}
      />

      <hr />
      <h2>Without Header Property</h2>
      <pre>
        {`
          <PT_TABLE
          content={[
            {
              property: "content",
              type: "more content",
              description: "some content"
            }
          ]}
        />
          `}
      </pre>
      <PT_TABLE
        content={[
          {
            property: "content",
            type: "more content",
            description: "some content"
          }
        ]}
      />
    </>
  );
};

export default TableDescription;
