import React from "react";
import PT_AUTH from "../components/auth/PT_AUTH";

const Auth = () => {
  return (
    <>
      <h1>Welcome to My Periodt</h1>
      <PT_AUTH providers={["google", "email"]} redirect_path={""} />
    </>
  );
};

export default Auth;
