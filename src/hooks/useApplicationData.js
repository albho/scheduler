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

    const currentDayAppointments = newState.days[currentDayIndex].appointments;
    const updatedSpotsCount = currentDayAppointments.reduce(
      (accumulator, appointment) => {
        const interview = newState.appointments[appointment].interview;
        if (interview === null) {
          return accumulator + 1;
        }

        return accumulator;
      },
      0
    );

    return (newState.days[currentDayIndex].spots = updatedSpotsCount);
  };

  // update state
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY: {
        return { ...state, day: action.value };
      }

      case SET_APPLICATION_DATA: {
        return { ...state, ...action.value };
      }

      case SET_INTERVIEW: {
        const { id, interview } = action.value;

        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null,
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };

        const newState = { ...state, appointments };
        updateRemainingSpots(newState, id);
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

    // enable WebSockets
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = event => {
      const msg = JSON.parse(event.data);

      if (msg.type === SET_INTERVIEW) {
        const { id, interview } = msg;
        return dispatch({ type: SET_INTERVIEW, value: { id, interview } });
      }
    };

    return () => {
      webSocket.close();
    };
  }, []);

  // set current day
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  // book or update interview
  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      return dispatch({
        type: SET_INTERVIEW,
        value: { id, interview },
      });
    });
  };

  // cancel interview
  const cancelInterview = id => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      return dispatch({
        type: SET_INTERVIEW,
        value: { id, interview: null },
      });
    });
  };

  return { state, bookInterview, cancelInterview, setDay };
}
