import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProfileUpdate from "./pages/ProfileUpdate/Profileupdate";


const App = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Profile" element={<ProfileUpdate />} />
    </Routes>
    </>
         )
};

export default App;