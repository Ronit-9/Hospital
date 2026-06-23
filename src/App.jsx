import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import SingleService from './pages/SingleService.jsx'
import Doctors from './pages/Doctors.jsx'
import Contact from './pages/Contact.jsx'
import Appointment from './pages/Appointment.jsx'
import News from './pages/News.jsx'
import SingleNews from './pages/SingleNews.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminDoctors from './pages/admin/AdminDoctors.jsx'
import AdminAppointments from './pages/admin/AdminAppointments.jsx'
import AdminContacts from './pages/admin/AdminContacts.jsx'
import AdminNews from './pages/admin/AdminNews.jsx'
import AdminServices from './pages/admin/AdminServices.jsx'
import AdminDepartments from './pages/admin/AdminDepartments.jsx'

import DoctorLayout from './layouts/DoctorLayout.jsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorAppointmentDetail from './pages/doctor/DoctorAppointmentDetail.jsx'
import DoctorProfile from './pages/doctor/DoctorProfile.jsx'
import PatientLayout from './layouts/PatientLayout.jsx'
import PatientDashboard from './pages/patient/PatientDashboard.jsx'
import PatientAppointments from './pages/patient/PatientAppointments.jsx'
import PatientRecords from './pages/patient/PatientRecords.jsx'
import PatientProfile from './pages/patient/PatientProfile.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:id', element: <SingleService /> },
      { path: 'doctors', element: <Doctors /> },
      { path: 'contact', element: <Contact /> },
      { path: 'appointment', element: <Appointment /> },
      { path: 'news', element: <News /> },
      { path: 'news/:id', element: <SingleNews /> }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'doctors', element: <AdminDoctors /> },
      { path: 'departments', element: <AdminDepartments /> },
      { path: 'appointments', element: <AdminAppointments /> },
      { path: 'news', element: <AdminNews /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'contacts', element: <AdminContacts /> },
    ]
  },
  {
    path: '/doctor',
    element: <DoctorLayout />,
    children: [
      { path: 'dashboard', element: <DoctorDashboard /> },
      { path: 'appointments', element: <DoctorAppointments /> },
      { path: 'appointments/:id', element: <DoctorAppointmentDetail /> },
      { path: 'profile', element: <DoctorProfile /> },
    ]
  },
  {
    path: '/patient',
    element: <PatientLayout />,
    children: [
      { path: 'dashboard', element: <PatientDashboard /> },
      { path: 'appointments', element: <PatientAppointments /> },
      { path: 'records', element: <PatientRecords /> },
      { path: 'profile', element: <PatientProfile /> },
    ]
  },
])

export default function App() {
  return <RouterProvider router={router} />
}