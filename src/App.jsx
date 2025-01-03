import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Details from './components/Details'
import Home from './pages/Home'
import './App.css'
import SignUp from './pages/Signup'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import CreateEmployee from './pages/CreateEmployee'
import Projects from './pages/Projects'
import CreateProjects from './pages/CreateProjects'
import ProjectDetails from './pages/ProjectDetails'
import Dashboard from './pages/Dashboard'
import AssignFeature from './pages/AssignFeature'
import ErrorPage from './pages/ErrorPage'
import Timesheet from './pages/Timesheet'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

function App() {

  const [allowedFeature, setAllowedFeature] = useState([]);
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = parseInt(decodedToken.sub, 10);
  
  const fetchFeatureAllowed = async() => {
    try{
        const token = localStorage.getItem('token');
        const response = await axios.post("http://localhost:3000/users/checkinguserfeature", 
        {userid: userId},
        {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );
        return response.data.allowed_features
    }catch(error){
        console.log("errror", error);
      }
  }

  const handleFetch = async () => {
    const allowedFeatures = await fetchFeatureAllowed();
    setAllowedFeature(allowedFeatures);
  };
  
  const isFeatureAllowed = (featureName) => {
    return allowedFeature.includes(featureName);
  }

  useEffect(()=> {
    handleFetch()
  },[])
 
  return (
    <div>
      <Routes>
        <Route
        path='/' 
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>  
        } />

        <Route 
        path="/users/details/:id" 
        element={
          <ProtectedRoute>
          <Details />
        </ProtectedRoute>
        } />

        <Route 
        path="/projects/:id" 
        element={ 
          <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
        } />

       <Route 
        path="/createemployee" 
        element={isFeatureAllowed("createemployee") ? ( <ProtectedRoute>
        <CreateEmployee/>
        </ProtectedRoute> )  : <ErrorPage/> } />

        <Route 
        path="/projects" 
        element={ isFeatureAllowed("projects") ? (
          <ProtectedRoute>
          <Projects/>
        </ProtectedRoute>
        ) : <ErrorPage/> } />

        <Route 
        path="/createproject" 
        element={ isFeatureAllowed("createproject") ? (
          <ProtectedRoute>
            <CreateProjects/>
          </ProtectedRoute> ) : ( <ErrorPage/> )
        } />

        <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
        } />

        <Route 
        path="/assignfeature" 
        element={
          isFeatureAllowed("assignfeature") ? ( <ProtectedRoute>
            <AssignFeature/>
           </ProtectedRoute>) : ( <ErrorPage/> )
        } />

        <Route 
        path="/removefeature" 
        element={
          isFeatureAllowed("removefeature") ? ( <ProtectedRoute>
            <AssignFeature/>
           </ProtectedRoute>) : ( <ErrorPage/> )
        } />

        <Route 
        path="/timesheet" 
        element={
          <ProtectedRoute>
          <Timesheet/>
         </ProtectedRoute>
        } />

        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/navbar' element={<Navbar/>} />
      </Routes>
    </div>
  )
}

export default App
