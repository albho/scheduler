import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  // update number of empty spots remaining available for booking
  const updateRemainingSpots = (newState, appointmentId) => {
    const currentDayIndex = newState.days.findIndex(day =>
      day.appointments.includes(appointmentId)
    );

    const updatedSpotsCount = newState.days[
      currentDayIndex
    ].appointments.reduce((accumulator, appointment) => {
      const interview = newState.appointments[appointment].interview;
      if (interview === null) {
        return accumulator + 1;
      }

      return accumulator;
    }, 0);

    newState.days[currentDayIndex].spots = updatedSpotsCount;
  };

  // update state
  const reducer = (state, action) => {
    let newState = { ...state };

    switch (action.type) {
      case SET_DAY: {
        newState.day = action.value;
        return newState;
      }

      case SET_APPLICATION_DATA: {
        return { ...newState, ...action.value };
      }

      case SET_INTERVIEW: {
        const { appointmentId, interview } = action.value;

        const appointment = {
          ...state.appointments[appointmentId],
          interview: interview ? { ...interview } : null,
        };

        const appointments = {
          ...state.appointments,
          [appointmentId]: appointment,
        };

        newState = { ...newState, appointments };
        updateRemainingSpots(newState, appointmentId);

        return newState;
      }

      default: {
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
      }
    }
  };

  // set & update state via reducer & dispatch
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // fetch data from API and update state
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(all => {
      const [days, appointments, interviewers] = all;

      return dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data,
        },
      });
    });
  }, []);

  // set current day
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  // book or update interview
  const bookInterview = (appointmentId, interview) => {
    return axios
      .put(`/api/appointments/${appointmentId}`, { interview })
      .then(() => {
        return dispatch({
          type: SET_INTERVIEW,
          value: { appointmentId, interview },
        });
      });
  };

  // cancel interview
  const cancelInterview = appointmentId => {
    return axios.delete(`/api/appointments/${appointmentId}`).then(() => {
      return dispatch({
        type: SET_INTERVIEW,
        value: { appointmentId, interview: null },
      });
    });
  };

  return { state, bookInterview, cancelInterview, setDay };
}
