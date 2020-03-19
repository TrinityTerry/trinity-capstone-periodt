import React, { useEffect } from "react";
import PT_CARD from "../components/cards/PT_CARD";

const MyLogs = ({ getLogs }) => {
  useEffect(() => {
    getLogs().then(data => console.log(data)
    )
  });
  return <>Hello there</>;
};

export default MyLogs;
