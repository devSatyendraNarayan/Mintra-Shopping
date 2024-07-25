import React, { useState, useContext } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../contexts/Firebase";
import { AuthContext } from "../contexts/AuthContext";
import RegisterModal from "./RegisterModal";

// Define validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function LoginModal() {
  // Use context to access and set user information
  const { setUser } = useContext(AuthContext);
  
  // State variables for managing form inputs and UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Hook Form setup with Yup resolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handlers for opening and closing the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Submit handler for login form
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);
      setSuccess("Login successful!");
      setTimeout(() => closeModal(), 1500); // Close modal after 1.5 seconds
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for forgotten password
  const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccess("Password reset email sent!");
      } catch (error) {
        setError("Error sending password reset email. Please try again.");
        console.error("Password reset error:", error);
      }
    }
  };

  // Function to render the login form
  const renderLoginForm = () => (
    <div className="flex flex-col items-center w-full max-w-md">
      <img
        src="https://cdn-icons-png.flaticon.com/128/3670/3670333.png"
        alt="Mintra-logo"
        className="w-20 h-20 mb-8"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <InputField
          type="email"
          placeholder="Email"
          register={register}
          name="email"
          error={errors.email}
          icon={<FaUser className="text-gray-400" />}
        />
        <InputField
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          register={register}
          name="password"
          error={errors.password}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          icon={<FaEye className="text-gray-400" />}
        />
        <div className="flex justify-end">
          <span
            className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm transition duration-300"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </span>
        </div>
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}
        <SubmitButton loading={loading} />
      </form>
      <ToggleRegister setShowLogin={setShowLogin} />
    </div>
  );

  return (
    <>
      <button onClick={openModal} className="hover:scale-110 transition-transform duration-300">
        <FaUser className="text-[#eb2540]" />
      </button>
      {isModalOpen && (
        <div className="modal-container">
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-md bg-white rounded-lg shadow-2xl p-8">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition duration-300"
                onClick={closeModal}
              >
                ✕
              </button>
              {showLogin ? renderLoginForm() : <RegisterModal setShowLogin={setShowLogin} />}
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}

// Component for input fields with validation error display
const InputField = ({
  type,
  placeholder,
  register,
  name,
  error,
  showPassword,
  togglePassword,
  icon,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      {...register(name)}
      className={`w-full pl-10 pr-3 py-2 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
      placeholder={placeholder}
    />
    {name === "password" && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button type="button" onClick={togglePassword} className="focus:outline-none">
          {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
        </button>
      </div>
    )}
    {error && <p className="mt-1 text-red-500 text-xs">{error.message}</p>}
  </div>
);

// Component for submit button with loading state
const SubmitButton = ({ loading }) => (
  <button
    type="submit"
    className="w-full bg-rose-500 text-white py-2 rounded-md hover:bg-rose-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
    disabled={loading}
  >
    {loading ? "Logging in..." : "LOGIN"}
  </button>
);

// Component to toggle between login and register forms
const ToggleRegister = ({ setShowLogin }) => (
  <div className="mt-4 text-center text-sm">
    <p>
      Don't have an account?{" "}
      <span
        className="font-semibold text-rose-500 cursor-pointer hover:text-rose-600 transition duration-300"
        onClick={() => setShowLogin(false)}
      >
        Register
      </span>
    </p>
  </div>
);

// Component for displaying error messages
const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <span className="block sm:inline">{message}</span>
  </div>
);

// Component for displaying success messages
const SuccessMessage = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
    <span className="block sm:inline">{message}</span>
  </div>
);

export default LoginModal;
