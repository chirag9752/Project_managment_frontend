import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";


const ProjectDetails = () => {

  const {id} = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const fetchProjectData = async() => {
      try{
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/projects/${id}`);
        setProjectData(response.data.data);
      }catch(error){
        toast.error(error);
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    fetchProjectData();
  }, [id]);

  if (loading) {
    return <div className="mt-5 text-lg font-semibold text-center">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
    <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Project Details</h2>
    {projectData && (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">ID:</span>
          <span className="text-gray-800">{projectData.id}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">Name:</span>
          <span className="text-gray-800">{projectData.project_name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">User_id:</span>
          <span className="text-gray-800">{projectData.user_id}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">Created At:</span>
          <span className="text-gray-800">
            {new Date(projectData.created_at).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">Updated At:</span>
          <span className="text-gray-800">
            {new Date(projectData.updated_at).toLocaleString()}
          </span>
        </div>
        </div>
       )}
     </div>
  )
}

export default ProjectDetails;