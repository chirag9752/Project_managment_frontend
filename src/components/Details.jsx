import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaEdit, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserProfileModal = () => {
  
  const navigate = useNavigate();
  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error , setError] = useState(null);
  const [flag, setflag] = useState(false);

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
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: (userData.data.role ? userData.data.role : "Not-assigned"),
    subrole: (userData.data.employee_type ? userData.data.employee_type : 'Sub role not assigned'),
    activities: userData.projects

  };

  const clickHandler = () => {
    navigate('/');
  }

  const HandleDetails = () => {
    setflag(prev => (!prev));
  }

  return (
    <div className="font-sans">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
          className="relative mt-[8%] top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
            <button
              className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
              aria-label="Close modal"
            >
              <FaTimes size={24} onClick={clickHandler} />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-blue-500 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                />
                <button
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
                  aria-label="Edit profile picture"
                >
                  <FaEdit size={16} />
                </button>
                </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
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

              <div className="mt-8">

                { userData.projects.length != 0 ?  (<div className="flex gap-[70%] justify-center mb-5">
                    <h4 className="text-xl pt-3 font-semibold text-gray-700">Recent Projects</h4>
                    <button
                          onClick={HandleDetails}
                          className=" bg-blue-500 rounded-lg text-white hover:text-black p-3 transition duration-300 ease-in-out">
                            {
                              flag === true ? ("Hide details") : ("View details")
                            }
                    </button>
                </div>) : (<div></div>)}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.activities.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition duration-300 ease-in-out"
                    >
                      <p className="text-gray-800 font-medium">{project.project_name}</p>
                      { flag === true ? (
                        <p className="text-gray-600 text-sm mt-1">{project.billing_rate}</p>
                      ) : (
                        <div></div>
                      ) }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default UserProfileModal;
