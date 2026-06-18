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
  }
])

export default function App() {
  return <RouterProvider router={router} />
}