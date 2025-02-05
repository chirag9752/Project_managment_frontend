import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SuccessPaymentPage from "../components/successpayment";

const SuccessPage = () => {
  const [session, setSession] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    try{
        const fetchSession = async() => {
            const query = new URLSearchParams(location.search);
            const sessionId = query.get("session_id");
            if (sessionId) {
            const response = await axios.get(`http://localhost:5173/api/stripe/session/${sessionId}`)
            console.log("response", response);
              if(response.status === 200){
                setSession(response.data);
              }
            }
        }
        fetchSession();
    }catch(error){
      console.log("Error fetching session:", error);
    }
    
  }, [location]);

  return (
    <div>
      {session ? (
        <SuccessPaymentPage session = {session}/>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SuccessPage;
