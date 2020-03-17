import React from "react";
import PT_AUTH from "../components/auth/PT_AUTH";
import PT_CARD from "../components/cards/PT_CARD";

const Auth = () => {
  return (
    
      <PT_CARD
        groupClass="login-card-group"
        cardArray={[
          {
            centered: true,
            content: (
              <>
                <h1>Welcome to Periodt</h1>
                <PT_AUTH providers={["google", "email"]} redirect_path={""} />
              </>
            )
          }
        ]}
      />
    
  );
};

export default Auth;
