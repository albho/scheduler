import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "./InterviewerList.scss";

export default function InterviewerList(props) {
  const listOfInterviewers = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={interviewer.id}
        {...interviewer}
        selected={props.interviewer === interviewer.id}
        setInterviewer={props.setInterviewer}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{listOfInterviewers}</ul>
    </section>
  );
}
