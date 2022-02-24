export function getAppointmentsForDay(state, day) {
  const result = [];

  for (const daysObj of state.days) {
    if (daysObj.name === day) {
      for (const appointmentId of daysObj.appointments) {
        if (state.appointments[appointmentId]) {
          result.push(state.appointments[appointmentId]);
        }
      }
    }
  }
  
  return result;
}
