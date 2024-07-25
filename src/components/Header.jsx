import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import { FaOpencart, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import LoginModal from "./LoginModal";
import { AuthContext } from "../contexts/AuthContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { CartContext } from "../contexts/CartContext";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../contexts/Firebase";
import ContactUsModal from "./ContactUsModal";

const Header = ({
  className = "",
  textColor = "text-white",
  showCategories = true,
  showUser = true,
  showWishlist = true,
  showCart = true,
  showMenu = true,
}) => {
  // State to store user details
  const [userDetails, setUserDetails] = useState(null);
  // State to control menu and dropdown visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State to manage messages (e.g., success or error)
  const [message, setMessage] = useState(null);

  // Refs for dropdown and menu for detecting clicks outside
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Contexts for wishlist, cart, and authentication state
  const { wishlist } = useContext(WishlistContext);
  const { cart } = useContext(CartContext);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Effect to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  // Toggle dropdown menu visibility
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
    setIsMenuOpen(false);
  }, []);

  // Toggle main menu visibility
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    setIsDropdownOpen(false);
  }, []);

  // Effect to handle clicks outside dropdown or menu to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !dropdownRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show temporary message
  const showMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // Handle user logout
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserDetails(null);
      setIsDropdownOpen(false);
      showMessage("Logout successful!", "success");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showMessage("Error logging out. Please try again.", "error");
    }
  }, [setUser, navigate, showMessage]);

  // Render the logo
  const renderLogo = useMemo(
    () => (
      <Link to="/" className="top-2 left-4 sm:left-6">
        <img
          className="w-12 cursor-pointer"
          src="https://cdn-icons-png.flaticon.com/128/3670/3670333.png"
          alt="Mintra-logo"
        />
      </Link>
    ),
    []
  );

  // Render category links
  const renderCategories = useMemo(
    () =>
      showCategories && (
        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-between">
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {["MEN", "WOMEN"].map((category) => (
                <Link
                  key={category}
                  to={`/${category.toLowerCase()}-category`}
                  className={`font-semibold ${textColor} hover:scale-105 transition-all ease-out cursor-pointer`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
    [showCategories, textColor]
  );

  // Render icons with badge for wishlist and cart
  const renderIconWithBadge = useCallback(
    (Icon, link, count) => (
      <Link to={link} className={`hover:text-[#eb2540] relative ${textColor}`}>
        <Icon />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    ),
    [textColor]
  );

  // Render user dropdown menu
  const renderUserDropdown = useMemo(
    () => (
      <div className={`relative ${textColor}`} ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center focus:outline-none"
        >
          <FaUser className={`hover:text-[#eb2540] ${textColor}`} />
        </button>
        {isDropdownOpen && (
          <div className="origin-top-right p-2 absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="flex flex-col justify-start px-2 py-2 text-sm text-gray-700">
                {userDetails ? (
                  <>
                    <p className="font-semibold">
                      Hello <span>{userDetails.name.split(" ")[0]}</span>
                    </p>
                    <span className="text-xs text-gray-600 truncate">
                      {userDetails.email}
                    </span>
                  </>
                ) : (
                  <p>Hello User</p>
                )}
              </div>
              <div className="w-full h-[1px] bg-gray-200 my-1"></div>
              <Link
                to="/orderedProducts"
                className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Orders
              </Link>
              <p
                className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <ContactUsModal />
              </p>
              <div className="w-full h-[1px] bg-gray-200 my-1"></div>
              <Link
                to="/account"
                className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-1 px-4 text-sm text-gray-700 hover:bg-rose-100"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    ),
    [textColor, isDropdownOpen, userDetails, toggleDropdown, handleLogout]
  );

  // Render mobile menu
  const renderMobileMenu = useMemo(
    () =>
      showMenu && (
        <div ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="sm:hidden items-center flex text-white hover:text-rose-400 focus:outline-none focus:text-gray-400"
          >
            <GiHamburgerMenu className={`hover:text-[#eb2540] ${textColor}`} />
          </button>
          {isMenuOpen && showCategories && (
            <div className="absolute right-0 mt-5 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {["MEN", "WOMEN"].map((category) => (
                  <Link
                    key={category}
                    to={`/${category.toLowerCase()}-category`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    [showMenu, toggleMenu, isMenuOpen, showCategories, textColor]
  );

  return (
    <nav
      className={`${className} px-5 fixed w-full z-50 top-0 left-0 shadow-lg`}
    >
      {message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.text}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          {renderLogo}
          {renderCategories}
          <div className="flex items-center right-0 absolute">
            <div className="flex space-x-5 items-center">
              {showWishlist &&
                renderIconWithBadge(GrFavorite, "/wishlist", wishlist.length)}
              {showCart && renderIconWithBadge(FaOpencart, "/bag", cart.length)}
              {showUser && !user && <LoginModal />}
              {showUser && user && renderUserDropdown}
              {renderMobileMenu}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
