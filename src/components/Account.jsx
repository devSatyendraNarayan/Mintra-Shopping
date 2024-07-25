import React, { useState, useEffect, useContext, useCallback } from "react";
import Header from "./Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auth, db } from "../contexts/Firebase"; // Firebase authentication and database
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore document operations
import { toast } from "react-toastify"; // Notifications
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading"; // Loading spinner component
import { AuthContext } from "../contexts/AuthContext"; // Context for authentication state

// Component for gender selection buttons
const GenderButton = ({ value, selected, onClick, children }) => (
  <button
    type="button"
    className={`btn text-gray-800 border border-gray-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white flex-grow hover:bg-gray-50 transition-colors ${
      selected ? "text-rose-500 border-rose-500" : ""
    }`}
    onClick={() => onClick(value)}
  >
    {children}
  </button>
);

// Component for input fields with a label
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  pattern,
}) => (
  <div className="form-control">
    <label className="label-text font-semibold text-gray-800 block mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="input input-bordered rounded-sm bg-white text-gray-800 w-full focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
      value={value}
      onChange={onChange}
      pattern={pattern}
      required
    />
  </div>
);

function Account() {
  const { user } = useContext(AuthContext); // Get the current user from context
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    mobile: "",
    birthday: null,
  }); // State to hold user data
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Function to fetch user data from Firestore
  const fetchUserData = useCallback(async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userDataFromDb = userDoc.data();
        setUserData({
          name: userDataFromDb.name || "",
          email: userDataFromDb.email || "",
          gender: userDataFromDb.gender || "",
          mobile: userDataFromDb.mobile || "",
          birthday: userDataFromDb.birthday
            ? new Date(userDataFromDb.birthday)
            : null,
        });
      } else {
        toast.error("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    } finally {
      setLoading(false); // Set loading to false after data fetch
    }
  }, []);

  // Effect to fetch user data on component mount and when authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
        toast.error("User not authenticated.");
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [fetchUserData]);

  // Handler for form submission to update user details
  const handleUserDetailsSubmit = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          name: userData.name,
          gender: userData.gender,
          mobile: userData.mobile,
          birthday: userData.birthday ? userData.birthday.toISOString() : null,
        });
        toast.success("Details updated successfully!");
      } catch (error) {
        console.error("Error updating user details:", error);
        toast.error("Failed to update details.");
      }
    } else {
      toast.error("User not authenticated.");
    }
  };

  // Handler for input field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for date picker changes
  const handleDateChange = (date) => {
    setUserData((prev) => ({ ...prev, birthday: date }));
  };

  if (loading) {
    return <Loading />; // Show loading spinner if data is still being fetched
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        className="bg-white shadow-md"
        textColor="text-gray-800"
        showCategories={false}
        showMenu={false}
      />

      <div className="container mx-auto px-4 py-8 mt-20 max-w-screen-xl">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-bold text-3xl text-gray-800">Account</h1>
            <p className="text-sm text-gray-500 mt-2">{userData.email}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl mb-6 font-bold text-gray-800 text-center">
              Edit Details
            </h2>

            <form onSubmit={handleUserDetailsSubmit} className="space-y-6">
              <InputField
                label="Full Name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />

              <div className="form-control">
                <label className="label-text font-semibold text-gray-800 block mb-2">
                  Gender
                </label>
                <div className="flex flex-row text-black items-center w-full gap-4">
                  <GenderButton
                    value="Male"
                    selected={userData.gender === "Male"}
                    onClick={(value) =>
                      setUserData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    Male
                  </GenderButton>
                  <GenderButton
                    value="Female"
                    selected={userData.gender === "Female"}
                    onClick={(value) =>
                      setUserData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    Female
                  </GenderButton>
                </div>
              </div>

              <div className="form-control">
                <label className="label-text font-semibold text-gray-800 block mb-2">
                  Birthday
                </label>
                <DatePicker
                  selected={userData.birthday}
                  onChange={handleDateChange}
                  className="input input-bordered rounded-sm bg-white text-gray-800 w-full focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Date"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
              </div>

              <InputField
                label="Mobile Number"
                name="mobile"
                value={userData.mobile}
                onChange={handleInputChange}
                type="tel"
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
              />

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="btn rounded-sm bg-rose-500 hover:bg-rose-600 text-white border-none py-3 px-6 transition-colors duration-300"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
