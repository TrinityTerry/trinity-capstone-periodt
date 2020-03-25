import React from "react";
import PT_AUTH from "../components/auth/PT_AUTH";
import PT_CARD from "../components/cards/PT_CARD";

const Auth = ({ verified, userData }) => {
  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <div className="login-card-group">
      <PT_CARD
        image="https://firebasestorage.googleapis.com/v0/b/periodt-1584121712792.appspot.com/o/logo.png?alt=media&token=5a7c7880-9bb5-4f7d-9730-0b237574cb3b"
        description={
          <>
            <PT_AUTH providers={["google", "email"]} redirect_path={""} />
          </>
        }
        header={!verified && userData && "You need to verify your account"}
        meta={!verified && userData && <a onClick={handleClick}>resend email verification</a>}
      />
    </div>
  );
};

export default Auth;
