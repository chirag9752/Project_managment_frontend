import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentWeekYear from "../components/UseCurrentWeekYear";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { executeFeature, fetchSingleTimesheet } from "../components/apiService";
import config from "../components/contants/config.json";
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import axios from "axios";

const Timesheet = () => {
  const [hours, setHours] = useState({
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  });

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentUserId = parseInt(decodedToken.sub, 10);
  const [description, setDescription] = useState("");
  const location = useLocation();
  const { timesheetData, currentProfileId } = location.state || {};   // React Router attaches the state object to the location. useLocation gives access to this state object, which allows you to retrieve the data you passed during navigation.
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { weekStartDate, weekEndDate, year } = useCurrentWeekYear(currentWeek);
  const [CurrentWeekData, setCurrentWeekData] = useState(null);
  const [printPdfAccess, setPrintPdfAccess] = useState(false);
  const navigate = useNavigate();
  const pdfRef = useRef();
  const [open, setOpen] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(()=> {
    const currentUserFeature = localStorage.getItem('current_user_feature');
    const current_user_feature_allowed = currentUserFeature.split(',');
    const value = current_user_feature_allowed?.find((feature) => feature === "timesheets");
    const value1 = current_user_feature_allowed?.find((feature) => feature === "print_pdf");
    if(value1 === 'print_pdf'){
      setPrintPdfAccess(true);
    }
    if(value !== "timesheets"){
      navigate('/error');
    }
  }, []);

  const handleHoursChange = (day, value) => {
    setHours((prev) => ({ ...prev, [day]: value }));
  };
  
  const fetchweekData = async() => {
    try{
      const response = await fetchSingleTimesheet(
        {
          WeekData: {
            profile_Id: currentProfileId,
            project_Id: timesheetData.id,
            week_start_date: weekStartDate
          },featureknown: {
            userid: currentUserId
          }
        }
      )     
      if(response){
        setCurrentWeekData(response.timesheet?.daily_hours);
        setDescription(response.timesheet?.description);
      }else{
        setCurrentWeekData(null);
        setDescription("");
      }
    }catch(error){
      setCurrentWeekData(null);
      setDescription("");
       console.log(error.response.data.error)
    }
  }

  useEffect(() => {
    fetchweekData();
  }, [weekStartDate, weekEndDate]);

  useEffect(() => {
    if (CurrentWeekData) {
      const updatedHours = { ...hours };
      Object.entries(CurrentWeekData).forEach(([day, value]) => {
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize day name
        if (Object.prototype.hasOwnProperty.call(updatedHours, capitalizedDay)) {
          updatedHours[capitalizedDay] = value; // Set existing hours from CurrentWeekData
        }
      });
      setHours(updatedHours);
    }else{
      setHours({Monday: "",
        Tuesday: "",
        Wednesday: "",
        Thursday: "",
        Friday: "",
        Saturday: "",
        Sunday: "",});
      setDescription("");
    }
  }, [weekStartDate, weekEndDate, CurrentWeekData]);

  const handleSubmit = async() => {
    try{
      if(description === "" || hours.Monday === "" || hours.Tuesday === "" || hours.Wednesday === "" || hours.Thursday === "" || hours.Friday === ""){
        toast.error("all details are mendatory");
        return;
      }
      const response = await executeFeature(
        {
         WeekData: {
           Hours: hours,
           Description: description,
           profile_Id: currentProfileId,
           project_Id: timesheetData.id,
           week_start_date: weekStartDate
         },
         featureknown: {
           feature_name: "timesheets",
           userid: currentUserId,
         }
        }
      )
      setCurrentWeekData(response.data);
      toast.success(config.Timesheet_update);
 
      }catch(error){
        console.log(error);
        toast.error(error.response.data.errors);
      }
  };

  const nextWeek = () => {
    const nextWeekStart = new Date(currentWeek);
    nextWeekStart.setDate(currentWeek.getDate() + 7); 
    setCurrentWeek(nextWeekStart);
  };

  const prevWeek = () => {
    const prevWeekStart = new Date(currentWeek);
    prevWeekStart.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeekStart);
  };

  const openHandler = () => {
    setOpen(true);
  }

  const handleDateChange = (e, dateStatus) => {
    const inputDate = e.target.value;
    const [year, month, day] = inputDate.split('-');
    const formattedDate = `${year}/${month}/${day}`;
    if(dateStatus === 'startDate'){
      setStartDate(formattedDate);
      console.log("startdate", startdate);
    }else{
      setEndDate(formattedDate);
      console.log("endDate", endDate);
    }
  };

  const checkdates = () => {
    const start = new Date(startdate.replace(/\//g, "-")); // Convert "YYYY/MM/DD" to "YYYY-MM-DD"
    const end = new Date(endDate.replace(/\//g, "-"));
    if(start > end){
      toast.error("Ending date should be greater than start date");
      return -1;
    }
  }

  const submitpdfHandler = async(e) => {
    e.preventDefault();
    try{
      if (checkdates() === -1){
        return;
      }
      const response = await axios.post("http://localhost:3000/timesheets/fetchpdf", {
        data: {
            userId: currentUserId,
            profileId: currentProfileId,
            projectId: timesheetData.id,
            startDate: startdate,
            endDate: endDate
        }
      },
       {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob"
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `timesheet_report_${startdate}_${endDate}.pdf`); // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }catch(error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download the PDF. Please try again.");
    }
  }

  const submitCSVHandler = async(e) => {
    e.preventDefault();
    try{
      if (checkdates() === -1){
        return;
      }
      const response = await axios.post("http://localhost:3000/timesheets/fetchcsv",{
        data: {
            userId: currentUserId,
            profileId: currentProfileId,
            projectId: timesheetData.id,
            startDate: startdate,
            endDate: endDate
        }
      },
       {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "timesheets.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div>
      {
        printPdfAccess ? (
        <button
        onClick={openHandler}
        className="bg-blue-500 p-2 m-5 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
        Print as PDF
        </button>
        ) : (<></>)
      }
       <div className="max-w-4xl mx-auto mt-[4%] p-6 bg-gray-100 rounded-lg shadow-md"
        ref = {pdfRef}
       >
       <h2 className="text-2xl font-semibold text-center mb-6">Weekly Timesheet of [{timesheetData.name}]</h2>
       {/* Week status */}
       <div className="mb-6 flex justify-between">
           <div className="flex gap-3 items-center">
             <button 
             className="bg-black text-white font-bold p-2 rounded-lg"
             onClick={prevWeek}>&lt;
             </button>

               <label className="block font-medium">Week Starting:</label>
               <p>{weekStartDate}</p>
           </div>

           <div className="pt-2">{year}</div>

           <div className="flex gap-3">
             <label className="block font-medium pt-2">Week Ending:</label>
             <p className="pt-2">{weekEndDate}</p>
             <button
             className="bg-black text-white font-bold p-2 rounded-lg"
             onClick={nextWeek}>&gt;
             </button>
           </div>
       </div>
 
       {/* Table */}
       <div className="mb-6 overflow-x-auto">
         <table className="w-full border-collapse border border-gray-300 rounded-lg">
           <thead>
             <tr className="bg-gray-200">
               <th className="border border-gray-300 p-2">Day</th>
               <th className="border border-gray-300 p-2">Hours</th>
             </tr>
           </thead>
           <tbody>
             {Object.keys(hours).map((day) => (
               <tr key={day} className="even:bg-gray-100">
                 <td className="border border-gray-300 p-2">{day}</td>
                 <td className="border border-gray-300 p-2">
                   <input
                     type="number"
                     min="0"
                     max="24"
                     value={hours[day]}
                     onChange={(e) => handleHoursChange(day, e.target.value)}
                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Hours"
                   />
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
 
       {/* Description */}
       <div className="mb-6">
         <label className="block font-medium mb-2">Add Description:</label>
         <textarea
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           maxLength="1000"
           placeholder="Enter any additional details..."
           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
       </div>
 
       {/* Actions */}
       <div className="flex justify-between">
         <button
           onClick={handleSubmit}
           className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
         >
          Submit
         </button>
         <button
           className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
           onClick={() => navigate(-1)}
         >
          Cancel
         </button>
       </div>
     </div>

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
              <div className="bg-white w-full p-1 justify-center cursor-pointer">
                  <div className="justify-evenly w-full p-2 flex">
                    <form onSubmit={(e) => submitpdfHandler(e)} >
                      <div >
                        <div className="p-2 gap-2 flex justify-center items-center">
                          <label htmlFor="startDate" className="w-full">start Date:</label>
                            <input type="date"
                            id="startDate"
                            value={startdate.replace(/\//g, '-')}
                            onChange={(e) => handleDateChange(e, 'startDate')}
                            className="mt-1 block w-full cursor-pointer h-14 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                          </div>
                        <div className="p-2 gap-2 flex justify-center items-center">
                          <label htmlFor="endDate" className="w-full">end Date: </label>
                            <input type="date"
                            id="endDate"
                            value={endDate.replace(/\//g, '-')}
                            onChange={(e) => handleDateChange(e, 'endDate')}
                            className="mt-1 mb-2 block cursor-pointer h-14 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                        </div>
                        <button type="submit" 
                        className="m-1 p-2 w-full hover:scale-105 bg-blue-600 text-white rounded-full font-extrabold hover:bg-slate-500"
                        >
                        Print-PDF</button>
                        <button onClick={submitCSVHandler} 
                        className="m-1 p-2 w-full hover:scale-105 bg-blue-600 text-white rounded-full font-extrabold hover:bg-slate-500"
                        >
                        Print-CSV</button>
                      </div>
                    </form>
                </div> 
              </div>
            </DialogPanel>
        </div>
      </div>
    </Dialog>) : (<></>)}

     </div>
    );  
};

export default Timesheet;
