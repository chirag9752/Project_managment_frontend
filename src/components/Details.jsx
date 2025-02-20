import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import config from '../components/contants/config.json'
import defaultimage from "../assets/defaultImage.jpg"
// import { saveProfile } from "./apiService";

const UserProfileModal = () => {

  const navigate = useNavigate();
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error , setError] = useState(null);
  const [file, setFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentUserId = parseInt(decodedToken.sub, 10);

  const handleChange = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchUser = async() => {
      try{
        setLoading(true);
        const response  = await axios.get(`http://localhost:3000/users/details/${id}`);
        setUserData(response.data);
      }catch(err){
          setError(err);
      }finally{
          setLoading(false);
      }
    };
    fetchUser();
  }, [id])

  if (loading) {
    return <div className="mt-5 text-lg font-semibold text-center">Loading...</div>;
  }
  if (error) {
    return <div className="mt-5 text-center text-red-500">{error}</div>;
  }

  const user = {
    name: userData.data.name,
    id: userData.data.id,
    email: userData.data.email,
    role: (userData.data.role ? userData.data.role : "Not-assigned"),
    subrole: (userData.data.employee_type ? userData.data.employee_type : 'Sub role not assigned'),
    activities: userData.projects
  };

  const clickHandler = () => {
    navigate('/');
  }

  const submitProfileHandler = async() => {
    try{
      if(file === null){
        toast.error("Please add a profile photo first");
        return;
      }
      const formData = new FormData();
      formData.append('user[profile_photo]', file);
      formData.append('user[email]', userData.data.email);
      formData.append('user[id]', userData.data.id);
      
      const response = await axios.post(`http://localhost:3000/users/update/profile/${currentUserId}`,formData);
      if(response.status == 200){
        toast.success(config.profileupdate);
      }
      // const response = await saveProfile(currentUserId, formData);
      // if(response.status === 200){
      //   toast.success(config.profileupdate);
      // }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="font-sans">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
          className="relative mt-[8%] top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 m-2">User Profile</h2>
            <button
              className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
              aria-label="Close modal"
            >
              <FaTimes size={24} onClick={clickHandler} />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex flex-col md:flex-row">
              <div className="relative space-y-2 items-center justify-center">
                  <div className="flex bg-gray-100 p-2">
                    <img
                      src={profileImage ? profileImage : ( userData.profile_photo_url ? userData.profile_photo_url : defaultimage )}
                      className="w-32 h-32 rounded-full border-4 border-blue-500 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                    />
                  </div>
                  { currentUserId === parseInt(id, 10) ? (
                    <div className="items-center mt-3 flex ">
                    <input type="file" 
                    onChange={handleChange}
                    className="m-2 p-1 w-32 text-transparent"
                    /> 
                  </div>
                  ) : (<></>) }
              </div>
                <div className="md:ml-6 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800">{user.name}  ({user.email}) </h3>
                  <div className="flex items-center justify-center md:justify-start mt-2 text-gray-600">
                    <FaBriefcase className="mr-2" />
                    <span>{user.role}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start mt-1 text-gray-600">
                    <FaBuilding className="mr-2" />
                    <span>{user.subrole}</span>
                  </div>
                  <span>ID: {user.id}</span>
                </div>
              </div>
            </div>
            { currentUserId === parseInt(id, 10) ? (
              <div>
                <button 
                  onClick={submitProfileHandler}
                  className=" flex justify-center items-center mx-auto w-[30%] font-extrabold p-2 rounded-md m-2 bg-blue-600 hover:bg-gray-500 text-white " 
                  > Submit 
                </button>
              </div>
            ) : (<></>)}
          </div>
        </div>
    </div>
  );
};

export default UserProfileModal;