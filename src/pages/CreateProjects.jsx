import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const CreateProjects = () => {

    const [formData, setFormData] = useState({
        project_name: "",
        billing_rate: "",
        user_id: ""
    });
    
    const Handlerfunction = (e) => {
        const {name, value} = e.target;
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    
    const CreateProjectHandler = async(event) => {
        event.preventDefault();
        
        if (!formData.project_name.trim() || !formData.billing_rate.trim() || !formData.user_id.trim()) {
            toast.error("Please fill out all the fields before submitting.");
            return; 
        }
        
        try{
            const res = await axios.post("http://localhost:3000/projects", formData, {
                headers: {
                    "Content-Type": "application/json",
                 },
                withCredentials: true, 
            });
            
            if(res.status === 201){
                toast.success("CreateProject Successfully");
                setFormData({ project_name: "",billing_rate: "",user_id: ""});
            }else{
              console.log(res.error);
            }
            
        }catch(err){
            console.log("error in creating project");
            toast.error(err);
        }
    }

    return(
        <div className="flex items-center justify-center h-full min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl overflow-hidden bg-white rounded-md shadow-md">
          <div className="flex flex-wrap">
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                alt="login form"
                className="object-cover w-full h-full"
              />
            </div>
  
            {/* Form Section */}
            <div className="flex flex-col w-full h-full p-6 md:w-1/2">
              <div className="flex items-center justify-center mb-4">
                <div className="mr-3 text-4xl text-orange-500">
                  <i className="fas fa-cubes"></i>
                </div>
                <h1 className="text-2xl font-bold">Manage ur Project</h1>
              </div>
  
              <h5 className="mb-6 text-lg tracking-wider text-center text-gray-600">
                Hey! create new Project👋
              </h5>

              <input
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="project_name"
                placeholder="Enter your name..."
                name="project_name"
                value={formData.project_name}
                onChange={Handlerfunction}
              />

              <input
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="billing_rate"
                placeholder="set billing_rate"
                name="billing_rate"
                value={formData.billing_rate}
                onChange={Handlerfunction}
              />
              
              <input
                className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="user_id"
                placeholder="assign_user with id"
                name="user_id"
                value={formData.user_id}
                onChange={Handlerfunction}
              />
  
              <button className="w-full px-5 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900"
              onClick={CreateProjectHandler}>
                CreateUrpG
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default CreateProjects;

       