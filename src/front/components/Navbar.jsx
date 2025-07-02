import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">My App</span>
        </Link>
        <div className="ml-auto">
          {store.auth.isAuthenticated ? (
            <div>
              <span className="me-3">Welcome, {store.auth.customer?.email}!</span>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => dispatch({ type: 'logout' })}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="btn btn-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};