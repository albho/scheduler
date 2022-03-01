import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // returns updated days array with correct number of spots
  const setSpots = action => {
    let spots = 0;

    for (const day of state.days) {
      if (day.name === state.day) {
        spots = day.spots
      }
    }

    const days = [...state.days];
    for (const day of days) {
      if (day.name === state.day) {
        if (action === "booking") {
          day.spots = spots - 1;
        } else {
          day.spots = spots + 1;
        }
      }
    }

    return days;
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;

      setState(prev => ({
        ...prev,
        days,
        appointments,
        interviewers,
      }));
    });
  }, []);

  const setDay = day => setState(prev => ({ ...prev, day }));

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = setSpots("booking");

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      setState(prev => ({ ...prev, appointments, days }));
    });
  };

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = setSpots();

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => setState(prev => ({ ...prev, appointments, days })));
  };

  return { state, setDay, bookInterview, cancelInterview };
}
