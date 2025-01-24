import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Bills = () => {
  const location = useLocation();
  const { billingData, currentProfileId } = location.state || {}; 
  const [viewdetails, setViewDetails] = useState(false);
  const navigate = useNavigate();

  const veiwbillingdetailsHandler = () => {
    setViewDetails((prev) => (!prev));
  }

  useEffect(() => {
    if(!currentProfileId && !billingData?.billing_rate)
    {
      navigate("/error");
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6">
        {/* Card Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Billing for project [ {billingData?.name} ]
          </h1>
        </div>

        {/* Billing Info Section */}
        <div className="flex flex-col space-y-4">
          {/* Example Additional Content */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Current Profile ID:</p>
            <span className="text-white bg-gray-400 p-3 rounded-md">{currentProfileId}</span>
          </div>

          {/* Example of more details */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-700">Billing Rate:</p>
            <span className="text-white bg-gray-400 p-3 rounded-md">{billingData?.billing_rate}</span>
          </div>

          {
            viewdetails ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">GST Number:</p>
                  <span className="text-white bg-gray-400 p-3 rounded-md">12345678</span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Payment Term:</p>
                  <span className="text-white bg-gray-400 p-3 rounded-md">Monthly</span>
                </div>
              </>
            ) : (<></>)
          }
        </div>

        {/* Card Footer */}
        <div className="mt-6 text-center"
         onClick={veiwbillingdetailsHandler}
        >
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
            {viewdetails ? ("Hide details") : ("View More Details")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bills;
