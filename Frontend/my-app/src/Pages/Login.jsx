import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login(){

  const [Email , setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if (!Email.trim() || !Password.trim()) {
      return toast.error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return toast.error("Invalid email format");
    }

    try{
      const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: Email,
      password: Password
    })

    toast.success(response.data.message);
    localStorage.setItem("userId", response.data.userId);

    window.location.href = "/home";       // it will redirect to home page once login is successful
    }
    catch(err){
      toast.error("Login failed");
    }
  }





    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back. Please enter your details.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e)=>setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link to="/signup" className="text-sm text-blue-600 hover:underline">
              Create account
            </Link>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;