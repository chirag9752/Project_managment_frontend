import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ProjectDetails = () => {

  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [timesheet , setTimesheet] = useState(false);
  const [billingaccess , setBillingAccess] = useState(false);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = parseInt(decodedToken.sub, 10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/projects/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setProjectData(response.data);
  
        // Extract user-specific project data after fetching project data
        const userProject = response.data.data.project_users.find(
          (project) => project.user_id === userId
        );
  
        if (userProject) {
          setTimesheet(userProject.timesheet);
          setBillingAccess(userProject.billing_access);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjectData();
  }, [id, token, userId]);

  if (loading) {
    return <div className="mt-5 text-lg font-semibold text-center">Loading...</div>;
  }

  const handleAccess = (route) => {
    navigate(route)
  };
  
  return (
    <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
    <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Project Details</h2>
    {projectData && (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">ID:</span>
          <span className="text-gray-800">{projectData.data.id}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">Name:</span>
          <span className="text-gray-800">{projectData.data.name}</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <span className="font-semibold text-gray-600">Users_Alloted :</span>
          [{
           projectData.data.users.map((user) => (
            <span key={user.id} className="text-gray-800">{user.name},</span>
           ))
         }  ]
        </div>

        <div className="flex justify-between items-center">
          {
            timesheet ? (<button
              onClick={() => handleAccess('/timesheet')}
              className={`text-white px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600`}
            >
              Timesheet
            </button>) : (<></>)
          }

          {
            billingaccess ? (<button
              onClick={() => handleAccess('/billing')}
              className={`text-white px-4 py-2 rounded-md bg-green-500 hover:bg-green-600`}
            >
              See Bills
            </button>) : (<></>)
          }
       </div>
      </div>
       )}
     </div>
  )
}

export default ProjectDetails;