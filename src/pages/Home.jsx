import { useEffect, useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllowedFeatures } from "../redux/features/featureSlice";

const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const toggleDrawer = () =>  setIsDrawerOpen(!isDrawerOpen);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const tokenvalue = localStorage.getItem('token');
  const decodedToken = jwtDecode(tokenvalue);
  const userId = parseInt(decodedToken.sub, 10);
  const dispatch = useDispatch();
  const {featureAllowed, error} = useSelector((state) => state.features);

  useEffect(() => {
    dispatch(fetchAllowedFeatures(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if(error){
      toast.error(error);
    }
  }, [error]);

  const isFeatureAllowed = (featureName) => {
    return featureAllowed.includes(featureName);
  }
  
  useEffect(() => {
    const fetchData = async() => {
      try{
        setLoading(true);
        const response = await axios.get("http://localhost:3000/users");
        setLoading(false);
        setUsers(response.data.data);
      }catch(error){
        setLoading(true);
        console.log("error in fetching all users data", error.message);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="App">
      {/* Navbar */}
      <div>
        <Navbar toggleDrawer = {toggleDrawer}
         dropdownVisible = {dropdownVisible}
          toggleDropdown = {toggleDropdown}/>
      </div>

      {/* Backdrop for dimming */}
      {isDrawerOpen && (
        <div
          className="backdrop"
          onClick={toggleDrawer}
        ></div>
      )}

       {/* navigation dropdown handle */}
      {dropdownVisible && (
        <div
        className="backdrop"
          onClick={toggleDropdown}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`drawer ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h5 className="p-3 text-base font-semibold text-center text-white uppercase bg-blue-900 dark:text-gray-400">
          Features
        </h5>
        <button
          onClick={toggleDrawer}
          className="close-btn text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <ul className="py-4 space-y-2 font-medium text-center">
          {
            featureAllowed.map((feature) =>
              isFeatureAllowed(feature) ? (
                <li key={feature}>
                  <Link
                    to={`/${feature.toLowerCase()}`}
                    className="block hover:scale-105 p-2 text-gray-900 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                  {feature.replace(/([a-z])([A-Z])/g, '$1 $2')}
                  </Link>
                </li>
              ) : null
            )
          }
        </ul>
      </div>
      
      {/* ALL Employees */}
      
      <div className="min-h-screen p-5 bg-gray-100">
      <h1 className="mb-5 text-3xl font-bold text-center"></h1>
      
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => (
            <Link to={`/users/details/${user.id}`} 
              key={user.id}
              className="p-4  hover:scale-105 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-2xl" 
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
    
    </div>
  );
};

export default Home;