const SuccessPaymentPage = () => {
  const currentDate = new Date(Date.now());
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-green-500 mb-4">
          Payment Successful!
        </h1>
        <div className="text-center mb-6">
          <p className="text-gray-600 text-lg">Thank you for your purchase!</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID:</span>
            <span className="text-gray-700">1234567890ABC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="text-gray-700">$1000.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Product:</span>
            <span className="text-gray-700">Timesheets Subscription</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method:</span>
            <span className="text-gray-700">Credit Card</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="text-gray-700">{formattedDate}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPaymentPage;
