import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

  const CreateEmployee = () => {
  const navigate = useNavigate();

  useEffect(()=> {
    const currentUserFeature = localStorage.getItem('current_user_feature');
    const featureAllowed = currentUserFeature.split(',');
    const value = featureAllowed?.find((feature) => feature === "createemployee");
    if(value !== "createemployee"){
    navigate('/error');
    }
  }, []);

  const [formData, setformData] = useState(
    { user: {
      email : "",
      password : "",
      name: "",
      role: "",
      employee_type: ""
    }}
  );

  const Handlerfunction = (event) => {
    const {name, value} = event.target;
      setformData( (prevdata) => ({
        ...prevdata,
        user: {
      ...prevdata.user,
      [name]: value,
        }
      }))
    };

  const CreateEmployeeHandler = async(event) => {
    event.preventDefault();

    if (!formData.user.email.trim() || !formData.user.password.trim() || !formData.user.name.trim()) {
      toast.error("Please fill out all the fields before submitting.");
      return; 
    }

    try{
      const res = await axios.post("http://localhost:3000/signup", formData);

      if(res.status === 200){
          toast.success("CreateEmployee Successfully");
          navigate("/");
          setformData({user: { email: "", password: "",  name: "", role: "", employee_type: ""}});
      }

    }catch(error){
      if (error.response) {
          if (error.status === 422) {
              toast.error("user already registered please check again");
          } else {
            toast.error(`${error.message}`);
          }
        } else {
          toast.error("Network error. Please check your connection.");
          }
      }
  }

  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl overflow-hidden bg-white rounded-md shadow-md">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="login form"
              className="object-cover w-full h-full"
              />
          </div>
  
          <div className="flex flex-col w-full h-full p-6 md:w-1/2">
            <div className="flex items-center justify-center mb-4">
              <div className="mr-3 text-4xl text-orange-500">
                <i className="fas fa-cubes"></i>
              </div>
              <h1 className="text-2xl font-bold">Manage ur Project</h1>
            </div>
  
            <h5 className="mb-6 text-lg tracking-wider text-center text-gray-600">
              Hey! HR create a new hire? 👋
            </h5>

            <input
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="name"
              placeholder="Enter your name..."
              name="name"
              value={formData.user.name}
              onChange={Handlerfunction}
            />

            <input
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.user.email}
              onChange={Handlerfunction}
            />
              
            <input
              className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="set Password"
              name="password"
              value={formData.user.password}
              onChange={Handlerfunction}
            />
              
            <div className="p-4">
              <div className="flex flex-row items-center gap-3 mb-4">
                <label className="block mb-2 font-medium text-gray-700">Role</label>
                <select
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="role"
                    value={formData.user.role}
                    onChange={Handlerfunction}
                  >
                    <option value="" disabled>
                        Select your role
                    </option>
                    <option value="HR">HR</option>
                    <option value="BD">BD</option>
                    <option value="developer">Developer</option>
                </select>
                </div>

                {
                formData.user.role === "developer" ? (
                  <div className="flex flex-row items-center gap-3 mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Type</label>
                    <select
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      name="employee_type"
                      value={formData.user.employee_type}
                      onChange={Handlerfunction}
                        >
                       <option value="" disabled>
                           Select Role type
                       </option>
                       <option value="Manager">Manager</option>
                       <option value="TeamLead">TeamLead</option>
                       <option value="JuniorDeveloper">Junior Developer</option>
                    </select>
                  </div>
                ) : (
                  <div>
                  </div>
                )
                }
            </div>
            <button className="w-full px-5 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900"
              onClick={CreateEmployeeHandler}>
                CreateEmployee
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CreateEmployee;