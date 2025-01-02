import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "./styles.css"; // Add your custom styling if required

const Timesheet = () => {
    const [weekEnding, setWeekEnding] = useState(new Date());
    const [hours, setHours] = useState({
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    });
    const [description, setDescription] = useState("");
  
    const handleHoursChange = (day, value) => {
      setHours((prev) => ({ ...prev, [day]: value }));
    };
  
    const handleSubmit = () => {
      console.log("Week Ending:", weekEnding);
      console.log("Hours:", hours);
      console.log("Description:", description);
      alert("Timesheet submitted!");
    };
  
    const handleSaveDraft = () => {
      console.log("Draft saved:", { weekEnding, hours, description });
      alert("Draft saved!");
    };
  
    return (
      <div className="max-w-4xl mx-auto mt-[4%] p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Weekly Timesheet</h2>
  
        {/* Week Ending */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Week Ending:</label>
          <DatePicker
            selected={weekEnding}
            onChange={(date) => setWeekEnding(date)}
            dateFormat="dd MMM yyyy"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
            onClick={() => console.log("Canceled")}
          >
            Cancel
          </button>
        </div>
      </div>
    );  
};

export default Timesheet;
