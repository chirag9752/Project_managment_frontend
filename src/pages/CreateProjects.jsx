import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { executeFeature, fetchUsers } from "../components/apiService";
import config from "../components/contants/config.json";

const CreateProjects = () => {
  const navigate = useNavigate();
  const tokenvalue = localStorage.getItem('token');
  const decodedToken = jwtDecode(tokenvalue);
  const userId = parseInt(decodedToken.sub, 10);
  const [inputValue, setInputValue] = useState("");
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [userList, setUserList] = useState([]);
  const [formData, setFormData] = useState({project:{ project_name: "",billing_rate: ""}});

  useEffect(()=> {
    const currentUserFeature = localStorage.getItem('current_user_feature');
    const featureAllowed = currentUserFeature.split(',');
    const value = featureAllowed?.find((feature) => feature === "createproject");
    if(value !== "createproject"){
      navigate('/error');
    }
  }, []);

  const fetchEmailsFromBackend = async () => {
    try {
      const response = await fetchUsers();
      return response.data.data;
      } catch (error) {
      toast.error(error.message);
      return [];
    }
  };

  let debounceLate = useRef(null);
  const handleInputChange = async (event) => {
    const query = event.target.value;
    setInputValue(query);
    if (debounceLate.current) {
      clearTimeout(debounceLate.current);
    }    
    debounceLate.current = setTimeout(async() => {
    if (query.trim()) {
      const emails = await fetchEmailsFromBackend();
      const filtered = emails.filter((user) =>
      user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmails(filtered);
    } else {
      setFilteredEmails([]);
      }
    }, 500);
  };

    const handleEmailSelect = (email) => {
      setInputValue(email);
      setFilteredEmails([]);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && inputValue.trim()) {
          setUserList((prevList) => [
            ...prevList,
            { email: inputValue.trim(), timesheet: false, billing_access: false , profile_name: ""},
          ]);
          setInputValue("");
          setFilteredEmails([]);
      }
    };

    const profilehandleKeyDown = (event , index) => {
      if (event.key === 'Enter') {
        const profile_value = event.target.value;
        setUserList((prevList) =>
          prevList.map((user, i) =>
            i === index ? { ...user, profile_name: profile_value } : user
          )
        );
      }
    }

    const profilechangehandler = async(event, index) => {
        const profile_value = event.target.value;
        setUserList((prevList) =>
          prevList.map((user, i) =>
            i === index ? { ...user, profile_name: profile_value } : user
          )
        );
    }

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
        const res = await executeFeature(
          {
            project:{
            project_name: formData.project.project_name,
            billing_rate: formData.project.billing_rate,
            user_List: userList
            },
            featureknown: {
              feature_name: "createproject",
              userid: userId,
            }
          }
        )

        console.log(res);
         
        if(res.status === 200){
          toast.success(config.Create_Project);
          setFormData({project:{ project_name: "",billing_rate: ""}});
          navigate("/");
        }
        }catch(err){
          toast.error(err.response.data.errors);
      }
    }

    return(
        <div className="flex items-center overflow-scroll justify-center h-auto min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl overflow-hidden mt-2 bg-white rounded-md shadow-md">
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
              <div className="w-[73%] mx-auto px-4 py-3 mb-4 rounded-lg font-sans">
                <div className="relative">
                  {/* Suggestions */}
                  {filteredEmails.length > 0 && (
                    <ul className="absolute rounded-md max-h-44 overflow-y-auto w-full bg-white border mx-auto border-gray-300 shadow-md">
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
                    <div>
                      <input
                        type="text"
                        onKeyDown={(event) => profilehandleKeyDown(event, index)}
                        onChange={(event) => profilechangehandler(event, index)}
                        placeholder="Search profile name"
                        className="px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
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
