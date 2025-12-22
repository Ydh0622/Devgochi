import "./App.css";
import { Routes, Route } from "react-router";

import BugHunter from "@/features/BugHunterGame/BugHunter.jsx";
import Home from "@/features/Home/Home";
import Game from "@/features/RhythmGame";
import RunningGame from "./features/RunningGame";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<BugHunter />} path="/BugHunter" />
      <Route element={<RunningGame />} path="/run" />
      <Route element={<Game />} path="/rhythm" />
    </Routes>
  );
}

export default App;
