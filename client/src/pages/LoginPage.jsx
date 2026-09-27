import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext"; // ✅ Fix casing

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext); // ✅ Correct context

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col relative"
      style={{ backgroundImage: `url(${assets.background})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Left */}
      <img
        src={assets.logo_big}
        alt="logo"
        className="w-[min(30vw,250px)] relative z-10"
      />

      {/* Right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg relative z-10 w-[min(90%,400px)]"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img
            src={assets.arrow_icon}
            alt="arrow"
            className="w-5 cursor-pointer"
            onClick={() => {
              setCurrState(currState === "Sign up" ? "Login" : "Sign up");
              setIsDataSubmitted(false);
            }}
          />
        </h2>

        {/* Sign up fields */}
        {currState === "Sign up" && !isDataSubmitted && (
          <>
            <input
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              placeholder="Full Name"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/* Bio after submission */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Provide a short bio..."
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        )}

        {/* Login fields */}
        {currState === "Login" && (
          <>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                className="text-sm text-violet-500 font-medium cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
