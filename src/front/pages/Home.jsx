import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { LoginForm } from "../components/LoginForm";
import { SignupForm } from "../components/SignupForm";

export const Home = () => {
  const { store } = useGlobalReducer();
  const [showLogin, setShowLogin] = useState(true);

  if (store.auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1>Welcome to My App</h1>
        <div className="btn-group" role="group">
          <button 
            className={`btn ${showLogin ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button 
            className={`btn ${!showLogin ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          {showLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
};