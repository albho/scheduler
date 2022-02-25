import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace) {
      return setMode(newMode);
    }

    setMode(newMode);

    setHistory(prev => [...prev, newMode]);
  };

  const back = function () {
    if (history.length < 2) {
      return;
    }

    const prevMode = history[history.length - 2];
    setMode(prevMode);

    setHistory(prev => prev.slice(0, -1));
  };

  return { mode, transition, back };
}
