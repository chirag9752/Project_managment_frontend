// import { useState } from 'react'
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
import RemoveFeature from './pages/RemoveFeature'
import ErrorPage from './pages/ErrorPage'
import Timesheet from './pages/Timesheet'
import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'

function App() {

  const token = useSelector((state) => state.auth.token);
  let role = null;
  if(token){
    const decodetoken = jwtDecode(token);
    role = decodetoken.role;
  }
 
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
        path="/users/:id" 
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
        element={ role == "HR" ? ( <ProtectedRoute>
          <CreateEmployee/>
        </ProtectedRoute> )  : <ErrorPage/> } />

        <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
          <Projects/>
        </ProtectedRoute>
        } />

        <Route 
        path="/createprojects" 
        element={
          <ProtectedRoute>
          <CreateProjects/>
        </ProtectedRoute>
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
          <ProtectedRoute>
          <AssignFeature/>
         </ProtectedRoute>
        } />

        <Route 
        path="/removefeature" 
        element={
          <ProtectedRoute>
          <RemoveFeature/>
         </ProtectedRoute>
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
