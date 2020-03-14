import React, { useEffect, useState } from "react";
import PT_Auth from "./auth/Auth";
import APIManager from "../api-manager/APIManager";

const DLMaster = ({ userInfo }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (userInfo !== null) {
      APIManager.getData("users", userInfo.uid, "user_typeId").then(data => {
        APIManager.getData("user_types", data, "name").then(data =>
          data === "admin" ? setIsAdmin(true) : setIsAdmin(false)
        );
      });
    }
  }, [userInfo]);

  return isAdmin == null ? (
    <div>Loading</div>
  ) : isAdmin ? (
    <div>Welcome to the design library</div>
  ) : (
    <>
      <div>Please sign into an admin account to view this page</div>
      <PT_Auth providers={["google", "email"]} redirect_path={"dl/master"} />
    </>
  );
};

export default DLMaster;
