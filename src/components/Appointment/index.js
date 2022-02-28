import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "../../hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRMING = "CONFIRMING";

const SAVING_MSG = "Saving...";
const DELETING_MSG = "Deleting...";
const CONFIRMING_MSG = "Are you sure you want to cancel?";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => transition(SHOW));
  };

  const deleteInterview = () => {
    transition(CONFIRMING);
  };

  const confirmDelete = () => {
    transition(DELETING);

    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
    });
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={deleteInterview}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === CONFIRMING && (
        <Confirm
          message={CONFIRMING_MSG}
          onConfirm={confirmDelete}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message={SAVING_MSG} />}
      {mode === DELETING && <Status message={DELETING_MSG} />}
    </article>
  );
}
