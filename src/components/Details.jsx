import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Details = () => {

    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error , setError] = useState(null);

    useEffect(() => {
        const fetchUser = async() => {
            try{
                setLoading(true);
                const response  = await axios.get(`http://localhost:3000/users/${id}`);
                setUserData(response.data.data);
            }catch(err){
                setError(err);
                console.log(err);
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

    return (
        <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">User Profile</h2>
        {userData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">ID:</span>
              <span className="text-gray-800">{userData.id}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">Name:</span>
              <span className="text-gray-800">{userData.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">Email:</span>
              <span className="text-gray-800">{userData.email}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">Role:</span>
              <span className="text-gray-800">{userData.role}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">Employee Type:</span>
              <span className="text-gray-800">{userData.employee_type}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">Created At:</span>
              <span className="text-gray-800">
                {new Date(userData.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-600">Updated At:</span>
              <span className="text-gray-800">
                {new Date(userData.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    )
}

export default Details;