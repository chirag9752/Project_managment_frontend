import { useState } from "react";
import PropTypes from 'prop-types';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import config from "../components/contants/config.json";
import test from "../assets/baba.png"

const Navbar = ({toggleDrawer, dropdownVisible, toggleDropdown}) => {

  const token = useSelector((state) => state.auth.token);
  const tokenvalue = localStorage.getItem('token');
  const decodedToken = jwtDecode(tokenvalue);
  const userName = decodedToken.name;
  const currentUserId = decodedToken.id;
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      localStorage.removeItem('current_user_feature');
      
      const response = await axios.delete('http://localhost:3000/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
          },
      });

      if (response.status === 200) {
        toast.success(config.Logout);
        localStorage.removeItem('token');
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.status.error);
      } else {
        console.error('Network Error:', error.message);
      }
    }
  };

  return (
    <nav className="relative bg-gray-200 border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between p-5 mx-auto max-w-screen-2xl">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" onClick={toggleDrawer} className="h-8 hover:cursor-pointer" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold hover:cursor-pointer whitespace-nowrap dark:text-white" 
          onClick={toggleDrawer}>
            ManageUR pj
          </span>
        </a>
        <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">

          <button
            type="button"
            className="flex text-sm bg-black rounded-full md:me-0 focus:ring-8 focus:ring-gray-100 dark:focus:ring-gray-600"
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-20 h-20 rounded-full"
              src={test}
              alt="user photo"
            />
          </button>

          {dropdownVisible && (
            <div className="z-50 absolute left-[79%] top-[3%] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
              <ul className="py-2">
              <li>
                  <Link to={`/users/details/${currentUserId}`} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    {userName}
                  </Link>
                </li>
                
                <li>
                  <Link to="/setting"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </Link>
                </li>
                
                {
                  token ? ( <li>
                    <div onClick= {logoutHandler}
                      className="block px-4 py-2 text-gray-700 cursor-pointer t ext-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </div>
                  </li> ) : ( <div></div> )
                }
               
              </ul>
            </div>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            menuVisible ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 mt-4 font-extrabold border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-200 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link to="/"
                aria-current="page"
              >
                <div className="block px-3 font-extrabold py-2 text-blue-600 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500">
                  Employees
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
    toggleDrawer: PropTypes.func, // Validate that toggleDrawer is a function and is required
    dropdownVisible: PropTypes.bool, 
    toggleDropdown: PropTypes.func
};

export default Navbar;
