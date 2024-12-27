import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

  const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setformData] = useState(
    {
      user: {
      email: "",
      password: "",
    }});

    const Handlerfunction = (event) => {
         
    const {name, value} = event.target;

    setformData( (prevdata) => ({
      ...prevdata,
      user: {
        ...prevdata.user,
        [name]: value,
    }}))}
    
    const LoginHandler = async (event) => {
      event.preventDefault();
      try {
        const res = await axios.post("http://localhost:3000/login", formData, {
          headers: {
            "Content-Type": "application/json",
          },
            withCredentials: true,
          });
          if (res.status === 200) {
            toast.success("Login Successfully");
            // localStorage.setItem("token", res.data.token); // Updated token path
            // localStorage.setItem("user", JSON.stringify(res.data.data.user)); // Updated user path
            const token = res.data.status.token;
            dispatch(login(token));
            navigate("/");
            setformData({user: { email: "",password: ""}});
          }
        } catch (error) {
          if (error.response) {
            const { status } = error.response;
            if (status === 400) {
              toast.error("Please fill all the details");
            } else if (status === 404) {
              toast.error("User not found. Please register first");
              navigate("/signup");
            } else if (status === 401) {
              toast.error("Invalid email or password");
            } else {
              toast.error("Something went wrong. Please try again.");
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
        }
      };
      

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
                Sign into your account
              </h5>
  
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
              onClick={LoginHandler}>
                Login
              </button>
  
              <a
                href="#!"
                className="block mb-6 text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </a>
  
              <p className="mb-6 text-sm text-gray-500">
                Do not have an account?{' '}
                <Link to="/signup" className="text-blue-500 hover:underline">
                    Signup
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
  
  export default Login;
  



















// import React, { useState } from 'react'
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({}) => {

//   const navigate = useNavigate();

//   const [formData , setformData] = useState(
//    { email : "" , password : ""}
//   );

//   const Handlerfunction = (event) => {
//        setformData( (prevData) => ({
//           ...prevData ,
//         [event.target.name] : event.target.value
        
//       }))
//   }

//   const loginHandler = (event) => {
        
//         event.preventDefault();
//         axios.post("http://localhost:3000/login" , formData).then( (res) => {
        
//         if(res.status === 200)
//         {
//            toast.success("login successfully");
//            localStorage.setItem("token" , res.data.token);
//            localStorage.setItem("user" , JSON.stringify(res.data.user));

//         //    navigate("/searchpage");

//         //    setisLogin(true);
//            setformData({ email : "" , password : ""});
//         }
        
//        } 
      
//       ).catch((error) => {
//         if (error.response && error.response.status === 400) {
//           toast.error("Please fill all the details");
//         } else if (error.response && error.response.status === 404) {
//           toast.error("User not found. Please register first");
//           navigate("/signup");
//         } else if(error.response && error.response.status === 401) {
//           toast.error("please check the password");
//           // console.log("please check the password", error.message);
//         }
//       } )
//   }

//   return (
//     <div>
//           <div className='relative w-screen h-screen mx-auto'>              
//                <div>
//                   <form onSubmit={loginHandler} className='absolute hover:shadow-2xl transition-all ease-linear
//                     bg-slate-300 rounded-md outline-2 justify-center p-6 items-center lg:w-[40%]
//                     md:w-[60%] left-[10%] sm:w-[80%] top-52 mx-auto flex flex-col'>
                    
//                     <h1 className='mt-0 mb-5 text-2xl font-bold'>Login</h1>

//                     <input className='w-full h-12 transition-all ease-linear rounded-md hover:shadow-xl' 
//                     type="email"
//                     placeholder=' Enter your Email' 
//                     onChange={Handlerfunction}
//                     value= {formData.email}
//                     name = "email"
//                     />
//                     <br />
//                     <input className='w-full h-12 transition-all ease-linear rounded-md hover:shadow-xl' 
//                     type="password" 
//                     placeholder=' Enter your password'
//                     onChange={Handlerfunction}
//                     value={formData.password}
//                     name='password'
//                     />
//                     <button className='w-full h-12 mx-auto mt-8 font-bold transition-all ease-linear bg-green-400 rounded-md outline-lime-50 hover:bg-slate-400' >Login</button>              
//                     <p className='mt-4' >Don't have an account ?<a href="/signup" className='text-blue-600 hover:underline'> signup</a> </p>
//                   </form>
//                </div>
//           </div>
//     </div>
//   )
// }

// export default Login