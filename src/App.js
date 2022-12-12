import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import { createContext, useState, useEffect } from "react";

export const currentUserContext = createContext();

const queryClient = new QueryClient();
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // getting stored value
    const User = localStorage.getItem("currentUser");
    const initialValue = JSON.parse(User);
    return initialValue || {};
  });
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    setCurrentUser(currentUser);
  }, [currentUser]);
  return (
    <currentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </QueryClientProvider>
      </Router>
    </currentUserContext.Provider>
  );
}

export default App;
