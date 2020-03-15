import React from "react";
import PT_AUTH from "../library/auth/Auth";

const Auth = () => {
  return (
    <>
      <h1>Welcome to My Periodt</h1>
      <PT_AUTH providers={["google"]} redirect_path={""} />
    </>
  );
};

export default Auth;
