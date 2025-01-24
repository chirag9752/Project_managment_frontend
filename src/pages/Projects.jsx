import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { executeFeature } from "../components/apiService";

const Projects = () => {

  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const decodeToken = token ? jwtDecode(token) : null;
  const userId = parseInt(decodeToken.sub, 10);
  const navigate = useNavigate();

  useEffect(()=> {
    const currentUserFeature = localStorage.getItem('current_user_feature');
    const featureAllowed = currentUserFeature.split(',');
    const value = featureAllowed?.find((feature) => feature === "projects");
    if(value !== "projects"){
      navigate('/error');
      return;
    }

    const getProjects = async() => {
      try{
        const response = await executeFeature(
          {
            featureknown: {
              feature_name: "projects",
              userid: userId
            }
          }
        )
        setProjects(response.data.data);
        setLoading(false);
        }catch(error){
        toast.error(error.response.data.error);
      }
    }

    getProjects();

    },[]);

    return (
      <div className="min-h-screen p-5 bg-gray-100">
        <h1 className="mb-8 text-4xl font-bold text-center">Project List</h1>
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {projects.map((project, index) => (
          <Link
            to={`/projects/${project.id}`}
            key={index}
            className="relative block w-full pt-[100%] overflow-hidden bg-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
            <div className="absolute top-0 left-0 w-full h-full p-4 border flex justify-center border-gray-700 rounded-lg">
              <h2 className="mb-1 text-lg font-medium">{project.name}</h2>
            </div>
          </Link>
            ))}
          </div>
        )}
    </div>
    )
}

export default Projects;