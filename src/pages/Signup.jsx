import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

  const SignUp = () => {

    const navigate = useNavigate();

    // :email, :password, :password_confirmation, :name, :role, :employee_type
    const [formData, setformData] = useState(
        { user: {
            email : "", password : "", name: ""
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
    }

    const SignupHandler = async(event) => {
          event.preventDefault();

          try{
            const res = await axios.post("http://localhost:3000/signup", formData, {
                headers: {
                    "Content-Type": "application/json",
                 },
                withCredentials: true, // Required for cookies
            });

            if(res.status === 201){
                toast.success("Signup Successfully");
                localStorage.setItem("token" , res.data.token);
                localStorage.setItem("user" , JSON.stringify(res.data.user));
                navigate("/");
                setformData({user: { email: "", password: "",  name: "", role: "", employee_type: ""}});
            }

          }catch(error){
            if (error.response) {
                const { status } = error.response;
                if (status === 422) {
                    toast.error("user already registered please login");
                    navigate("/login");
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
                Sign up into your account
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
                placeholder="Password"
                name="password"
                value={formData.user.password}
                onChange={Handlerfunction}
              />
  
              <button className="w-full px-5 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900"
              onClick={SignupHandler}>
                Signup
              </button>
  
              <a
                href="#!"
                className="block mb-6 text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </a>
  
              <p className="mb-6 text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
              </p>
  
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <a href="#!" className="hover:underline">
                  Terms of use
                </a>
                <a href="#!" className="hover:underline">
                  Privacy policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUp;