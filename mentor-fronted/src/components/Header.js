import React, { useEffect, useState, useRef } from "react";
import { FaUserCircle, FaSun, FaMoon, FaSignOutAlt, FaUser, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDropdownMenu } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice.js";
import authService from "../services/authService";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileNav, setMobileNav] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const userData = useSelector((store) => store.user);
  const dropdownRef = useRef(null);

  // Dark Mode State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isAuthenticated = !!userData;
  const loginName = userData ? userData.user?.name || userData.name : "Login";

  const handleAuthentication = () => {
    if (isAuthenticated) {
      setUserDropdown(!userDropdown);
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(removeUser());
      setUserDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      dispatch(removeUser());
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="w-full relative z-50">
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md fixed w-full top-0 shadow-sm border-b border-neutral-100 dark:border-neutral-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto grid grid-flow-col content-center px-6 p-4 font-sans">
          <div className="col-span-1 cursor-pointer text-4xl font-bold text-primary-600 dark:text-primary-400">logo</div>
          <div className="col-span-10 content-center hidden md:block">
            <ul className="flex justify-center items-center gap-12 text-neutral-600 dark:text-neutral-300 font-medium">
              <li className="">
                <NavLink
                  to="/find-mentor"
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30"
                >
                  Find a mentor
                </NavLink>
              </li>
              <li className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                <NavLink
                  className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold" : "")}
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                <NavLink
                  className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold" : "")}
                  to="/blogs"
                >
                  Blog
                </NavLink>
              </li>
              <li className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                <NavLink
                  className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold" : "")}
                  to="/pricing"
                >
                  Pricing
                </NavLink>
              </li>
              {userData?.user?.role === 'mentor' && (
                <li className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                  <NavLink
                    className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold" : "")}
                    to="/mentor/dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          <div className="text-4xl content-center flex gap-6 justify-end items-center text-neutral-600 dark:text-neutral-300">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} className="text-yellow-400" />}
            </button>

            <RxDropdownMenu
              onClick={() => setMobileNav(!mobileNav)}
              className="md:hidden cursor-pointer hover:text-primary-600 transition-colors"
            />
            <div className="relative" ref={dropdownRef}>
              <div className="text-center cursor-pointer group flex flex-col items-center" onClick={handleAuthentication}>
                <FaUserCircle className="text-3xl mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                <p className="text-xs font-semibold">{isAuthenticated ? loginName : "Login"}</p>
              </div>

              {/* User Dropdown Menu */}
              {isAuthenticated && userDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden z-50">
                  <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="font-bold text-neutral-900 dark:text-white">{loginName}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{userData?.user?.email || userData?.email}</p>
                  </div>
                  <ul className="py-2">
                    {/* Admin Dashboard Link - Only show for admin users */}
                    {(userData?.user?.role === 'admin' || userData?.role === 'admin') && (
                      <li>
                        <button
                          onClick={() => {
                            setUserDropdown(false);
                            navigate("/admin");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-3 text-primary-600 dark:text-primary-400 font-semibold"
                        >
                          <FaUserCircle className="text-sm" />
                          <span>Admin Dashboard</span>
                        </button>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/profile"
                        className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 text-neutral-700 dark:text-neutral-300"
                        onClick={() => setUserDropdown(false)}
                      >
                        <FaUser className="text-sm" />
                        <span>My Profile</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/bookings"
                        className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3 text-neutral-700 dark:text-neutral-300"
                        onClick={() => setUserDropdown(false)}
                      >
                        <FaCalendarAlt className="text-sm" />
                        <span>My Bookings</span>
                      </NavLink>
                    </li>
                    <li className="border-t border-neutral-100 dark:border-neutral-800 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
                      >
                        <FaSignOutAlt className="text-sm" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {mobileNav && (
            <div className="bg-white dark:bg-neutral-900 absolute leading-loose rounded-xl shadow-xl z-20 md:hidden top-20 right-4 w-48 border border-neutral-100 dark:border-neutral-800 overflow-hidden">
              <ul className="flex flex-col text-neutral-600 dark:text-neutral-300">
                <li className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <NavLink
                    className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold block p-4" : "block p-4")}
                    to="/"
                    onClick={() => setMobileNav(false)}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <NavLink
                    className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold block p-4" : "block p-4")}
                    to="/blogs"
                    onClick={() => setMobileNav(false)}
                  >
                    Blog
                  </NavLink>
                </li>
                <li className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <NavLink
                    className={({ isActive }) => (isActive ? "text-primary-600 dark:text-primary-400 font-bold block p-4" : "block p-4")}
                    to="/pricing"
                    onClick={() => setMobileNav(false)}
                  >
                    Pricing
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Spacer for fixed header */}
      <div className="h-24 dark:bg-neutral-950 transition-colors"></div>
    </div>
  );
}

export default Header;
