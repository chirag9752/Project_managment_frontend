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
import Timesheet from './pages/Timesheet'
import ErrorPage from './pages/ErrorPage'

function App() {
 
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
        element={<ProtectedRoute>
        <CreateEmployee/>
        </ProtectedRoute>}/>

        <Route 
        path="/projects" 
        element={ <ProtectedRoute>
          <Projects/>
        </ProtectedRoute>} />

        <Route 
        path="/createproject" 
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
            <AssignFeature/>
           </ProtectedRoute>
        } />

        <Route 
        path="/projects/:id/timesheet" 
        element={
          <ProtectedRoute>
          <Timesheet/>
         </ProtectedRoute>
        } />

        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/navbar' element={<Navbar/>} />
        <Route path='/error' element={<ErrorPage/>} />
      </Routes>
    </div>
  )
}

export default App
