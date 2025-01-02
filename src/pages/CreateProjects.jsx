import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateProjects = () => {

  const navigate = useNavigate();
  const tokenvalue = localStorage.getItem('token');
  const decodedToken = jwtDecode(tokenvalue);
  const userId = parseInt(decodedToken.sub, 10);
  const [inputValue, setInputValue] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [userList, setUserList] = useState([]);
  const [formData, setFormData] = useState({project:{ project_name: "",billing_rate: ""}});
  
    const fetchEmailsFromBackend = async () => {
      try {
          const response = await axios.get("http://localhost:3000/users",
            {
              headers: {
                Authorization: `Bearer ${tokenvalue}`,
                }
            }
          );
          return response.data.data;
          } catch (error) {
          console.log(error.message);
          toast.error(error.message);
          return [];
        }
    };

    const handleInputChange = async (event) => {
      const query = event.target.value;
      setInputValue(query);
      if (query.trim()) {
        const emails = await fetchEmailsFromBackend();
        const filtered = emails.filter((user) =>
          user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredEmails(filtered);
      } else {
        setFilteredEmails([]);
      }
    };

    const handleEmailSelect = (email) => {
      setInputValue(email);
      setFilteredEmails([]);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && inputValue.trim()) {
        const alreadyAdded = userList.some((user) => user.email === inputValue.trim());
        if (!alreadyAdded) {
          setUserList((prevList) => [
            ...prevList,
            { email: inputValue.trim(), timesheet: false, billing_access: false },
          ]);
          setInputValue("");
        } else {
          toast.error("Email already added");
        }
        event.preventDefault();
      }
    };

    const toggleAccess = (index, type) => {
      setUserList((prevList) =>
        prevList.map((user, i) =>
          i === index ? { ...user, [type]: !user[type] } : user
        )
      );
    };

    const Handlerfunction = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            project: {
              ...prevData.project,
              [name]: value
            }
        }));
    }

    const handleRemoveTag = (indexToRemove) => {
      setUserList((prevTags) => prevTags.filter((_, index) => index !== indexToRemove));
    };
    
    const CreateProjectHandler = async(event) => {
        event.preventDefault();
        
        try{
          const token = localStorage.getItem('token');
          const res = await axios.post("http://localhost:3000/users/execute_feature",
            {
              project:{
              project_name: formData.project.project_name,
              billing_rate: formData.project.billing_rate,
              user_List: userList
              },
              featureknown: {
                feature_name: "createproject",
                userid: userId,
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
            
            if(res.status === 201){
                toast.success("CreateProject Successfully");
                setFormData({project:{ project_name: "",billing_rate: ""}});
                navigate("/projects");
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
            {/* Form Section */}
            <div className="flex flex-col w-full h-full p-6 md:w-full">
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
                className="w-[70%] mx-auto px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="project_name"
                placeholder="Enter your name..."
                name="project_name"
                value={formData.project.project_name}
                onChange={Handlerfunction}
              />

              <input
                className="w-[70%] mx-auto px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="billing_rate"
                placeholder="set billing_rate"
                name="billing_rate"
                value={formData.project.billing_rate}
                onChange={Handlerfunction}
              />
              
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter email"
                className="w-[70%] mx-auto px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
           
              <div className="w-[70%] mx-auto px-4 py-3 mb-4 rounded-lg font-sans">
                    <div className="relative">
                      {/* Suggestions */}
                      {filteredEmails.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md mt-1">
                          {filteredEmails.map((user) => (
                            <li
                              key={user.email}
                              onClick={() => handleEmailSelect(user.email)}
                              className="p-2 cursor-pointer hover:bg-blue-100"
                            >
                              {user.email}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* User List */}
                    <div className="mt-6">
                      {userList.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 mb-2 bg-gray-100 border border-gray-300 rounded"
                        >
                          <span className="text-gray-700">{user.email}</span>
                          <div className="space-x-2">
                            <button
                              onClick={() => toggleAccess(index, "timesheet")}
                              className={`px-3 py-1 rounded ${
                                user.timesheet
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {user.timesheet ? "Timesheet" : "Timesheet"}
                            </button>
                            <button
                              onClick={() => toggleAccess(index, "billing_access")}
                              className={`px-3 py-1 rounded ${
                                user.billing_access
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {user.billing_access ? "Billing" : "Billing"}
                            </button>
                            <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="font-bold p-2 m-2 hover:text-white rounded-3xl bg-gray-300"
                          >
                            x
                          </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

            
            
              <button className="w-[70%] mx-auto px-5 py-3 mb-4 text-white bg-gray-800 rounded-lg hover:bg-gray-900"
              onClick={CreateProjectHandler}>
                CreateUrpG
              </button>
            </div>
        </div>
      </div>
    )
}

export default CreateProjects;




// {

// const [filteredUsers, setFilteredUsers] = useState([]);
  // const [tags, setTags] = useState([]);
  // const [inputValue, setInputValue] = useState("");

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter" && inputValue.trim() !== "") {
  //     if (!tags.includes(inputValue.trim())) {
  //       setTags((prevTags) => [...prevTags, inputValue.trim()]);
  //       setInputValue("");
  //     } else {
  //       toast.error("Item already added.");
  //     }
  //     event.preventDefault();
  //   }
  // };

  // const handleRemoveTag = (indexToRemove) => {
  //   setTags((prevTags) => prevTags.filter((_, index) => index !== indexToRemove));
  // };

  // const Userarr = async() => {
  //   try {
  //       const response = await axios.get("http://localhost:3000/users",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${tokenvalue}`,
  //             }
  //         }
  //       );
  //       console.log("response data", response);
  //       return response.data;
       
          
  //    } catch (error) {
  //       console.log(error.message);
  //       toast.error(error.message);
  //       return [];
  //     }
  //   };




// <div className="flex flex-col items-center w-full max-w-md mx-auto mt-10">
// //   <div className="w-full px-4 py-2 mb-4 bg-white border rounded-lg shadow">
// //     <div className="flex flex-wrap gap-2 p-2">
// //       {tags.map((tag, index) => (
// //         <div
//           key={index}
//           className="flex items-center px-2 py-1 text-sm text-white bg-blue-500 rounded-md"
//         >
//           <span>{tag}</span>
//           <button
//             type="button"
//             onClick={() => handleRemoveTag(index)}
//             className="ml-2 text-xs text-red-200 hover:text-white"
//           >
//             x
//           </button>
//         </div>
//       ))}
    
//     <div>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyDown}
//         placeholder="Type and press Enter..."
//         className="flex-grow p-1 border-none focus:outline-none"
//       />
//       {filteredUsers.length > 0 && (
//       <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-auto">
//         {filteredUsers.map((user) => (
//           <li
//             key={user.id}
//             onClick={() => {
//               // setParticularUserId(user.id);
//               // setuserIdHandler(user.id);
//               setInputValue(user.email);
//               setFilteredUsers([]);
//             }}
//             className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//           >
//             {user.email} (ID: {user.id})
//          </li>
//        ))}
//       </ul>)}
//     </div>
//     </div>
//   </div>
// </div>}