import React, { useContext } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { currentUserContext } from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(currentUserContext);
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setCurrentUser({});
        navigate('/')
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  return (
    <div className="flex items-center justify-between p-4 z-[100] w-full absolute">
      <Link to="/">
        <h1 className="text-red-600 text-4xl font-bold cursor-pointer">
          NETFLIX
        </h1>
      </Link>
      {currentUser?.email ? (
        <div>
          <Link to="/account">
            <button className="text-white pr-4">Account</button>
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 px-6 py-2 rounded cursor-pointer text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button className="text-white pr-4">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="bg-red-600 px-6 py-2 rounded cursor-pointer text-white">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

// <div>
// <Link to="/account">
//   <button className="text-white pr-4">Account</button>
// </Link>
// <button
//   className="bg-red-600 px-6 py-2 rounded cursor-pointer text-white"
// >
//   Logout
// </button>
// </div>
