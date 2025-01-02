import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"


const useCurrentUserRole = () => {
   const [role , setRole] = useState(null);
   const tokenValue = localStorage.getItem('token');

   console.log(role, "role in hook");

   useEffect(() => {
    const getUserCurrentRole = () => {
        if(!tokenValue) return null;
        try{
            const decodeToken = jwtDecode(tokenValue);
            return decodeToken.role;
        }catch(error){
            console.log(error);
        }
    };
    const value = getUserCurrentRole();
    setRole(value);
   },[tokenValue, role])

   return role;
}

export default useCurrentUserRole;