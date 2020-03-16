import React from "react";
import PT_TABLE from "../components/tables/PT_TABLE";
import PT_ICON from "../components/icons/PT_ICON";

const IconDescription = ({ history }) => {
  return (
    <>
      <PT_TABLE
        content={[
          {
            property: "name",
            type: "string",
            description: "name of icon"
          },
          {
            property: "disabled",
            type: "boolean [default: false]",
            description: "show the icon as disabled"
          }
        ]}
      />

<hr />
<h2>Disabled </h2>
  <pre>
    {`
        <PT_ICON name="plus" disabled={true}/>

    `}
  </pre>

  <PT_ICON name="plus" disabled={true}/>

<hr />

<h2>Standard</h2>
  <pre>
    {`
        <PT_ICON name="plus"/>

    `}
  </pre>

  <PT_ICON name="plus"/>

<hr />

<h2>Calendar</h2>
  <pre>
    {`
        <PT_ICON name="calendar alternate outline"/>
        <PT_ICON name="calendar"/>
    `}
  </pre>
  <PT_ICON name="calendar alternate outline"/>
  <PT_ICON name="calendar"/>

<hr />
<h2>Comment</h2>
  <pre>
    {`
        <PT_ICON name="comment outline"/>
        <PT_ICON name="comment"/>
    `}
  </pre>
  <PT_ICON name="comment outline"/>
  <PT_ICON name="comment"/>

<hr />
<h2>Colors</h2>
  <pre>
    {`
        <PT_ICON name="paint brush"/>
        <PT_ICON name="tint"/>
    `}
  </pre>
  <PT_ICON name="paint brush"/>
  <PT_ICON name="tint"/>

<hr />
<h2>CRUD</h2>
  <pre>
    {`
        <PT_ICON name="trash alternate outline"/>
        <PT_ICON name="trash alternate"/>
        <PT_ICON name="edit outline"/>
        <PT_ICON name="pencil alternate"/>
    `}
  </pre>
  <PT_ICON name="trash alternate outline"/>
  <PT_ICON name="trash alternate"/>
  <PT_ICON name="edit outline"/>
  <PT_ICON name="pencil alternate"/>

  <hr />
<h2>Picture</h2>
  <pre>
    {`
        <PT_ICON name="image outline"/>

    `}
  </pre>
  <PT_ICON name="image outline"/>

<hr />
<h2>General</h2>
  <pre>
    {`
        <PT_ICON name="sign out alternate"/>
        <PT_ICON name="home"/>
        <PT_ICON name="cog"/>
        <PT_ICON name="bell"/>
        <PT_ICON name="bell outline"/>
    `}
  </pre>
  <PT_ICON name="sign out alternate"/>
  <PT_ICON name="home"/>
  <PT_ICON name="cog"/>
  <PT_ICON name="bell"/>
  <PT_ICON name="bell outline"/>

<hr />
<h2>Company</h2>
  <pre>
    {`
        <PT_ICON name="github"/>
        <PT_ICON name="google"/>
        <PT_ICON name="linkedin"/>
        <PT_ICON name="react"/>
    `}
  </pre>
  <PT_ICON name="github"/>
  <PT_ICON name="google"/>
  <PT_ICON name="linkedin"/>
  <PT_ICON name="react"/>

    </>
  );
};

export default IconDescription;
