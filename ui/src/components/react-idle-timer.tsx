import React, { FC, useState, useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { message } from "antd";
import { useMsal } from "../components/msal-react-lite";
import moment from "moment";
//const HelloWorld: FC<any> = () => {
const ReactIdleTimer: FC<any> = (props: any) => {
  const [expirationTime, setExpirationTime] = useState<string>("");
  const [enableCounter, setEnableCounter] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const expirationTimer = process.env.REACT_APP_LOGOUT_TIMER;

  const { logout, isLoggedIn } = useMsal();

  useEffect(() => {
    var timeFunction;
    if (enableCounter) {
      if (expirationTime === "") {
        var date = moment()
          .add(parseInt(expirationTimer ?? "120000") / 1000, "seconds")
          .format("LTS");
        setExpirationTime(date);
        message.warning(`session expires at ${date}`, 0);
      }
      timeFunction = setTimeout(function () {
        setCurrentTime(moment().format("LTS"));
      }, 1000);

      if (
        currentTime >= expirationTime &&
        currentTime !== "" &&
        expirationTime !== ""
      ) {
        logout();
        clearTimeout(timeFunction);
        setExpirationTime("");
        setEnableCounter(false);
      }
    } else {
      clearTimeout(timeFunction);
      setExpirationTime("");
    }
  }, [enableCounter, currentTime]);

  const handleOnIdle = (event: any) => {
    if (isLoggedIn) {
      console.log(`user is idle`, event);
      console.log("last active", getLastActiveTime());

      //message.warning(`Your session will expire at ${expirationTime}`, 0);
      setEnableCounter(true);
      setCurrentTime(moment().format("LTS"));
    }
  };

  const handleOnActive = (event: any) => {
    console.log("user is active", event);
    console.log("time remaining", getRemainingTime());
  };

  const handleOnAction = (e: any) => {
    console.log("user did something", e);
    message.destroy();

    setExpirationTime("");
    setEnableCounter(false);
    setCurrentTime(moment().format("LTS"));
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: parseInt(process.env.REACT_APP_IDLE_TIMER ?? "15000"),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });

  return <div>{props.children}</div>;
};

export default ReactIdleTimer;
