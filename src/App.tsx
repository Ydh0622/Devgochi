import "./App.css";
import { Routes, Route } from "react-router";
import Home from "@/features/Home/Home";
import RunningGame from "./features/RunningGame";
import RhythmGame from "@/features/RhythmGame";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<RunningGame />} path="/run" />
      <Route element={<RhythmGame />} path="/rhythm" />
    </Routes>
  );
}

export default App;
