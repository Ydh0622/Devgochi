import "./App.css";
import { Routes, Route } from "react-router";
import Home from "@/pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
    </Routes>
  );
}

export default App;
