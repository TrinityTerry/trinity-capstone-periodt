import React from "react";
import PT_AUTH from "../components/auth/PT_AUTH";
import PT_CARD from "../components/cards/PT_CARD";
import PT_BUTTON from "../components/buttons/PT_BUTTON";
import * as firebase from "firebase";

const Auth = ({ verified, userData, sendverificationEmail, logout }) => {
  const handleClick = () => {
    sendverificationEmail(userData);
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="login-card-group">
      <PT_CARD
        image="https://firebasestorage.googleapis.com/v0/b/periodt-1584121712792.appspot.com/o/logo.png?alt=media&token=5a7c7880-9bb5-4f7d-9730-0b237574cb3b"
        description={
          <>
            {!verified && userData ? (
              <>
                <hr />
                <PT_BUTTON content="Cancel" handleClick={handleLogout} />
              </>
            ) : (
              <PT_AUTH providers={["google", "email"]} redirect_path={""} />
            )}
          </>
        }
        header={!verified && userData && "You need to verify your account"}
        meta={
          !verified &&
          userData && (
            <a className="resend-email" onClick={handleClick}>
              resend email verification
            </a>
          )
        }
      />
    </div>
  );
};

export default Auth;
