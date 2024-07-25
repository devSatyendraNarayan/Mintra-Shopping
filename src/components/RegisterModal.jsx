import React, { useState, useContext } from "react";
import { FaUser, FaEye, FaEyeSlash, FaCheckCircle, FaEnvelope, FaExclamationCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, db } from "../contexts/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";

// Validation schema for form input using Yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
});

function RegisterModal({ setShowLogin }) {
  const { setUser } = useContext(AuthContext); // Accessing user context
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [message, setMessage] = useState({ text: "", type: "" }); // State to manage messages (success/error)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema), // Hook form setup with Yup validation
  });

  // Form submission handler
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Check if email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, data.email);
      if (signInMethods.length > 0) {
        setMessage({ text: "This email is already registered. Please use a different email or try logging in.", type: "error" });
        return;
      }

      // Create new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), { name: data.name, email: data.email });
      
      setUser(firebaseUser); // Set user in context
      setMessage({ text: "Registration successful!", type: "success" });
      setTimeout(() => setShowLogin(true), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({ text: getErrorMessage(error), type: "error" }); // Show error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/3670/3670333.png"
          alt="Mintra-logo"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
      </div>

      {/* Display message if any */}
      {message.text && <AlertMessage message={message.text} type={message.type} />}

      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          type="text"
          name="name"
          placeholder="Full Name"
          register={register}
          error={errors.name}
          icon={<FaUser className="text-gray-400" />}
        />
        <InputField
          type="email"
          name="email"
          placeholder="Email Address"
          register={register}
          error={errors.email}
          icon={<FaEnvelope className="text-gray-400" />}
        />
        <InputField
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          register={register}
          error={errors.password}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          icon={<FaEye className="text-gray-400" />}
        />
        <InputField
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          register={register}
          error={errors.confirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          icon={<FaEye className="text-gray-400" />}
        />
        <SubmitButton loading={loading} />
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <LoginLink setShowLogin={setShowLogin} />
    </div>
  );
}

// Input field component with optional password visibility toggle
const InputField = ({
  type,
  name,
  placeholder,
  register,
  error,
  showPassword,
  setShowPassword,
  icon,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      {...register(name)}
      className={`block w-full pl-10 pr-10 py-2 bg-white border ${
        error ? 'border-red-300' : 'border-gray-300'
      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-gray-900`}
      placeholder={placeholder}
    />
    {(name === "password" || name === "confirmPassword") && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    )}
    {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
  </div>
);

// Submit button component with loading indicator
const SubmitButton = ({ loading }) => (
  <button
    type="submit"
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
      loading ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={loading}
  >
    {loading ? (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      'Sign up'
    )}
  </button>
);

// Component for showing link to login page
const LoginLink = ({ setShowLogin }) => (
  <div className="text-sm text-center">
    <p className="font-medium text-rose-600 hover:text-rose-500 cursor-pointer" onClick={() => setShowLogin(true)}>
      Already have an account? Log in
    </p>
  </div>
);

// Alert message component to display success or error messages
const AlertMessage = ({ message, type }) => (
  <div className={`rounded-md p-4 ${type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
    <div className="flex">
      <div className="flex-shrink-0">
        {type === 'error' ? (
          <FaExclamationCircle className="h-5 w-5 text-red-400" />
        ) : (
          <FaCheckCircle className="h-5 w-5 text-green-400" />
        )}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium ${type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
          {message}
        </p>
      </div>
    </div>
  </div>
);

// Function to get appropriate error message based on error code
const getErrorMessage = (error) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Email is already registered.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak.";
    default:
      return "An error occurred during registration.";
  }
};

export default RegisterModal;
