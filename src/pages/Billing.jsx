import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentWeekYear from "../components/UseCurrentWeekYear";
import { jwtDecode } from "jwt-decode";
import { fetchSingleTimesheet } from "../components/apiService";

const Timesheet = () => {
  const [hours, setHours] = useState({
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: ""
  });

  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const currentUserId = parseInt(decodedToken.sub, 10);
  const location = useLocation();
  const { timesheetData, currentProfileId } = location.state || {};
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { weekStartDate, weekEndDate, year } = useCurrentWeekYear(currentWeek);
  const [CurrentWeekData, setCurrentWeekData] = useState(null);
  console.log("currentweek data", timesheetData);
  const [totalHours, setTotalHours] = useState(0);
  const navigate = useNavigate();

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
        console.log(response);
        setTotalHours(response.timesheet?.total_hours);
        setCurrentWeekData(response.timesheet?.daily_hours);
      }else{
        setCurrentWeekData(null);
        setTotalHours("");
      }
    }catch(error){
      setCurrentWeekData(null);
      setTotalHours("");
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
        Sunday: ""
      });
      setTotalHours("");
    }
  }, [weekStartDate, weekEndDate, CurrentWeekData]);

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

    return (
      <div className="max-w-4xl mx-auto mt-[4%] p-6 bg-gray-100 rounded-lg shadow-md">
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
                      readOnly
                      value={hours[day]}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Hours"
                    />
                  </td>
                </tr>
              ))}

              <tr className="even:bg-gray-100">
                <td className="border border-gray-300 p-2">ToTal Hours</td>
                <td className="border border-gray-300 p-2">
                  <input
                  value={totalHours ?? ""}
                  readOnly
                  maxLength="100"
                  placeholder="total Hours of this week"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>

              <tr className="even:bg-gray-100">
                <td className="border border-gray-300 p-2">Billing per Hours </td>
                <td className="border border-gray-300 p-2">
                  <input
                  value={timesheetData?.billing_rate ?? ""}
                  readOnly
                  maxLength="100"
                  placeholder="Billing of per Hours"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
              
              <tr className="even:bg-gray-100">
                <td className="border border-gray-300 p-2">Billing of This week </td>
                <td className="border border-gray-300 p-2">
                  <input
                  value={totalHours ? totalHours * timesheetData.billing_rate : "" }
                  readOnly
                  maxLength="100"
                  placeholder="please update timesheet for see billing"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>      
            </tbody>
          </table>
        </div>
        {/* Actions */}
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    );  
};

export default Timesheet;