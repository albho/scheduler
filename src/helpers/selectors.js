export function getAppointmentsForDay(state, someDay) {
  const foundDay = state.days.find(dayContainer => {
    return dayContainer.name === someDay;
  });

  const result = foundDay
    ? foundDay.appointments.map(appointmentId => {
        return state.appointments[appointmentId];
      })
    : [];

  return result;
}

export function getInterviewersForDay(state, someDay) {
  const foundDay = state.days.find(dayContainer => {
    return dayContainer.name === someDay;
  });

  const result = foundDay
    ? foundDay.interviewers.map(interviewerId => {
        return state.interviewers[interviewerId];
      })
    : [];

  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const interviewer = state.interviewers[interviewerId];
  const completeInterviewInfo = { ...interview, interviewer };

  return completeInterviewInfo;
}
