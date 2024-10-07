import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MakeMeet from "./MakeMeet";
import MeetDetail from "./MeetDetail";
import Gemini from "./Gemini";

// 메인 컴포넌트
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MakeMeet />} />
        <Route path="/:id" element={<MeetDetail />} />
        <Route path="/ai" element={<Gemini />} />
      </Routes>
    </Router>
  );
};

export default App;
