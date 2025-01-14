import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3000/users/execute_feature",
          {
          featureknown: {
            feature_name: "projects",
            userid: userId
             },
          },
          {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            withCredentials: true,
          }
        );

        setProjects(response.data.data);
        setLoading(false);
        }catch(err){
        toast.error(err);
        }
    }

    getProjects();

    },[]);

    return (
        <div className="min-h-screen p-5 bg-gray-100">
          <h1 className="mb-5 text-3xl font-bold text-center">Project List</h1>
            {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {projects.map((project) => (
                        <Link to={`/projects/${project.id}`}
                        key={project.id}
                        className="p-4 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-2xl"
                        >
                        <h2 className="text-xl font-semibold text-gray-800">
                            {project.name}
                        </h2>
                        <p className="text-gray-600">{project.email}</p>
                        </Link>
                    ))}
                </div>
            )}
    </div>
    )
}

export default Projects;