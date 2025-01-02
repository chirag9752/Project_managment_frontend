import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold text-red-600">403</h1>
        <h2 className="text-xl text-gray-700 mt-4">You are not authorized to access this route</h2>
        <p className="text-gray-500 mt-2">Please check your permissions or contact support.</p>
        <div className="mt-6">
          <Link to= "/"
           className="text-blue-500 hover:text-blue-700 text-lg cursor-pointer font-semibold">Go Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
