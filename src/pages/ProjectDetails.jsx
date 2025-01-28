import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import { fetchProjectDetails } from "../components/apiService";

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
  const [seeBillingProfile, setseeBillingProfile] = useState(false);
  // const [currentProfileId, setCurrentProfileId] = useState(null);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await fetchProjectDetails(id);
        setProjectData(response);
        // Extract user-specific project data after fetching project data
        const userProject = response.data.project_users.find(
          (project) => project.user_id === userId
        );

        if (userProject) {
          setTimesheet(userProject.timesheet);
          setBillingAccess(userProject.billing_access);
          // setCurrentProfileId(userProject.profile_id);
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

  const handleAccess = () => {
    setOpen(true);
  };

  const navigatebillshandler = () => {
    setseeBillingProfile(true);
  }

  const timesheetHandler = (route, timesheetData, currentProfileId) => {
    navigate(route ,{ state: { timesheetData , currentProfileId} });
  }

  const billingHandler = ( route, billingData, currentProfileId ) => {
    navigate(route, {state: {billingData, currentProfileId} });
  }

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
           projectData.data.users.map((user, index) => (
            <span key={index} className="text-gray-800">{user.name},</span>
           ))
         }  ]
        </div>

        <div className="flex justify-between items-center">
          {
            timesheet ? (<button
              onClick={() => handleAccess()}
              className={`text-white px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600`}
            >
              Timesheet
            </button>) : (<></>)
          }

          {
            
            billingaccess ? (<button
              className={`text-white px-4 py-2 rounded-md bg-green-500 hover:bg-green-600`}
              onClick={() => navigatebillshandler()}
            >
              See Bills
            </button>) : (<></>)
          }
       </div>
      </div>
       )}

       { open ? (<Dialog open = {open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-violet-800 justify-center items-center cursor-pointer flex sm:flex sm:flex-row-reverse"
                 >
                  <div className="w-full p-2 mx-auto justify-center flex flex-wrap">
                  { projectData &&
                    projectData.data.project_users.map((user_profile) => 
                      user_profile.user_id === userId && user_profile.timesheet ? (
                        <li key={user_profile.profile_id}
                        className="text-white p-2 hover:scale-125 justify-center text-center items-center font-bold flex w-full"
                        onClick={() => timesheetHandler(`/projects/${id}/timesheet`, projectData.data, user_profile.profile_id)}
                        >
                          GO To {user_profile.profile_name}
                        </li>
                      ) : null
                    )
                  }
                </div> 
              </div>
            </DialogPanel>
        </div>
      </div>
    </Dialog>) : (<></>)}


    { seeBillingProfile ? (<Dialog open = {seeBillingProfile} onClose={setseeBillingProfile} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-violet-800 justify-center items-center cursor-pointer flex sm:flex sm:flex-row-reverse"
                 >
                  <div className="w-full p-2 mx-auto justify-center flex flex-wrap">
                  { projectData &&
                    projectData.data.project_users.map((user_profile) => 
                      user_profile.user_id === userId && user_profile.billing_access ? (
                        <li key={user_profile.profile_id}
                        className="text-white p-2 hover:scale-125 justify-center text-center items-center font-bold flex w-full"
                        onClick={() => billingHandler(`/projects/${id}/bills`, projectData.data, user_profile.profile_id)}
                        >
                          GO To {user_profile.profile_name}
                        </li>
                      ) : null
                    )
                  }
                </div> 
              </div>
            </DialogPanel>
        </div>
      </div>
    </Dialog>) : (<></>)}
     </div>
  )
}

export default ProjectDetails;