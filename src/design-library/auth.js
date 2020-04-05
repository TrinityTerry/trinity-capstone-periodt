import React, { useState } from "react";
import PT_AUTH from "../components/auth/PT_AUTH";
import PT_TABLE from "../components/tables/PT_TABLE";
import { Accordion, Icon } from "semantic-ui-react";

const AuthDescription = ({ history }) => {
  const [activeIndex, setActiveIndex] = useState();
  const [providers, setProviders] = useState(["google", "email"]);
  const [redirect_path, setRedirectPath] = useState("#");
  const [user, setUser] = useState("admin");

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  return (
    <>
      <hr />
      <Accordion styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          <Icon name="dropdown" />
          Props
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <PT_TABLE
            content={[
              {
                property: "providers",
                required: "required",
                value: "",
                default: `["google","email"]`,
                type: "array",
                description: "List of providers user can use to login/signup",
              },
              {
                property: "redirect_path",
                required: "",
                default: "",
                type: "string",
                description:
                  "Path that the user will be taken to when they succesfully login in",
              },
              {
                property: "user",
                required: "",
                default: "",
                type: "string",
                description:
                  "Can pass in admin string to only allow users that are an admin to login.",
              },
            ]}
          />
        </Accordion.Content>
      </Accordion>
      <p>Component used to allow the user to Login/Signup</p>

      <PT_AUTH
        providers={providers}
        redirect_path={redirect_path}
        user={user}
      />

      <pre>
        {`
        import PT_AUTH from "../components/auth/PT_AUTH";

        <PT_AUTH
            providers={${providers}}
            redirect_path={${redirect_path}}
            user={${user}}
        />
          `}
      </pre>
    </>
  );
};

export default AuthDescription;
