import React from "react";
import "./styles.scss";

export default function Appointment(props) {
  let message = "No appointment.";
  if (props.time) {
    message = `Appointment at ${props.time}.`;
  }
  return <article className="appointment">{message}</article>;
}
