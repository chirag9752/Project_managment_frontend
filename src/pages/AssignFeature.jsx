import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

  const AssignFeature = () => {
  const [userId, setUserId] = useState("");
  const [featureId, setFeatureId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [featureSearch, setFeatureSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentUserId = parseInt(decodedToken.sub, 10);
  const navigate = useNavigate();

  useEffect(()=> {
    const currentUserFeature = localStorage.getItem('current_user_feature');
    const featureAllowed = currentUserFeature.split(',');
    const value = featureAllowed?.find((feature) => feature === "assignfeature");
    if(value !== "assignfeature"){
      navigate('/error');
    }
  }, []);
 
    const Userarr = async () => {
    try {
        const response = await axios.get("http://localhost:3000/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              }
          }
        );
        return response.data;
          
     } catch (error) {
        toast.error(error.message);
        return [];
      }
    };

  const handleUserSearch = async(query) => {
    try{
      setUserSearch(query);
      const value = await Userarr();
      if (Array.isArray(value.data)) {
        setFilteredUsers(
          value.data.filter((user) =>
            user.name.toLowerCase().includes(query.toLowerCase())
        ))
      }
    }catch(error){
      toast.error(error.message);
    }
  };

  const featureAllowed = async() => {
    try{
        const response =  await axios.get("http://localhost:3000/users/features/index",
        {
          headers: {
          Authorization: `Bearer ${token}`,
          }
        }
        );
        return response.data;
        }catch(error){
        toast.error(error.message);
        return [];
      }
    }

  const handleFeatureSearch = async(query) => {
    try{
      setFeatureSearch(query);
      const value = await featureAllowed();
      if (Array.isArray(value.data)) {
        setFilteredFeatures(
          value.data.filter((feature) =>
            feature.feature_name.toLowerCase().includes(query.toLowerCase())
          ))
      }
    }catch(error){
       toast.error(error.message);
       return [];
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:3000/users/execute_feature", 
      {
          assign_feature:{
          user_id: userId,
          feature_name: featureSearch
        },
        featureknown: {
        feature_name: "assignfeature",
         userid: currentUserId
         }
      },
      {
        headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
        },
       withCredentials: true,
      });

      if(response.status === 201){
        toast.success("Assigned feature Successfully");
        navigate("/");
        }else{
          console.log(response.error);
        }
    }catch(error){
       toast.error( error.response.data.errors);
    }
  };

  const RemoveAssignFeatureHandler = async(e) => {
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:3000/users/execute_feature", 
      {
          assign_feature:{
          user_id: userId,
          feature_name: featureSearch
        },
        featureknown: {
        feature_name: "removefeature",
         userid: currentUserId
         }
      },
      {
               headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
        },
       withCredentials: true,
      });

      if(response.status === 201){
        toast.success("Removed feature Successfully");
        navigate("/");
        }else{
          console.log(response.error);
        }
    }catch(error){
       toast.error(error.response.data.errors);
    }

  }

  return (
    <div className="max-w-lg mt-40 mx-auto p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Assign Feature to User
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID Search Bar */}
        <div>
          <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700">
            Search User by Name
          </label>
          <input
            type="text"
            id="userSearch"
            value={userSearch}
            onChange={(e) => handleUserSearch(e.target.value)}
            placeholder="Type to search users"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* Suggestions for Users */}
          {filteredUsers.length > 0 && (
            <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    setUserId(user.id);
                    setUserSearch(user.name);
                    setFilteredUsers([]);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {user.name} (ID: {user.id})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Feature ID Search Bar */}
        <div>
          <label htmlFor="featureSearch" className="block text-sm font-medium text-gray-700">
            Search Feature by Name
          </label>
          <input
            type="text"
            id="featureSearch"
            value={featureSearch}
            onChange={(e) => handleFeatureSearch(e.target.value)}
            placeholder="Type to search features"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* Suggestions for Features */}
          {filteredFeatures.length > 0 && (
            <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-auto">
              {filteredFeatures.map((feature) => (
                <li
                  key={feature.id}
                  onClick={() => {
                    setFeatureId(feature.id);
                    setFeatureSearch(feature.feature_name);
                    setFilteredFeatures([]);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {feature.feature_name} (ID: {feature.id})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hidden Inputs to Store IDs */}
        <input type="hidden" value={userId} name="userId" />
        <input type="hidden" value={featureId} name="featureId" />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enabled
        </button>

      <br />
      <button
          onClick={RemoveAssignFeatureHandler}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Disabled
        </button>
      </form>
    </div>
  );
};

export default AssignFeature;