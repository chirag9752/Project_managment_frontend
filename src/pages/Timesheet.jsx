import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentWeekYear from "../components/UseCurrentWeekYear";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { executeFeature, fetchSingleTimesheet } from "../components/apiService";
import config from "../components/contants/config.json";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input,{
      useCORS: true,
      allowTaint: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio)/2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('timesheet.pdf');
    })
  }

  return (
    <div>
      {
        printPdfAccess ? (
        <button
        onClick={downloadPDF}
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
           maxLength="100"
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
     </div>
    );  
};

export default Timesheet;
