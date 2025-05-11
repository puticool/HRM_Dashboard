import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-slate-900">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">
          Login to Dashboard
        </h1>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              placeholder="username"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p>Use API endpoint:</p>
            <code className="mt-1 block rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">
              https://ba64-2001-ee0-4b74-f010-fdad-87bd-ad0e-8e02.ngrok-free.app/auth/token
            </code>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <svg className="mr-2 size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 