import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "../../hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRMING = "CONFIRMING";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

const SAVING_MSG = "Saving...";
const DELETING_MSG = "Deleting...";
const ERROR_SAVE_MSG = "Could not save appointment.";
const ERROR_DELETE_MSG = "Could not cancel appointment.";
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

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  };

  const editInterview = () => {
    transition(EDITING);
  };

  const deleteInterview = () => {
    transition(CONFIRMING);
  };

  const confirmDelete = () => {
    transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={editInterview}
          onDelete={deleteInterview}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === EDITING && (
        <Form
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          student={props.interview.student}
          onCancel={back}
          onSave={save}
        />
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
      {mode === ERROR_SAVE && <Error message={ERROR_SAVE_MSG} onClose={back} />}
      {mode === ERROR_DELETE && (
        <Error message={ERROR_DELETE_MSG} onClose={back} />
      )}
    </article>
  );
}
