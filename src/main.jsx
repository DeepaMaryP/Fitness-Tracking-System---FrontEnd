import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import ErrorPage from './pages/ErrorPage'
import LayOutPage from './pages/LayOutPage'
import Home from './pages/Home'
import AddUserPage from './pages/admin/AddUserPage'
import UserListPage from './pages/admin/userListPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLayOutPage from './pages/admin/AdminLayOutPage'
import Login from './pages/auth/Login'
import ManageTrainerPage from './pages/admin/ManageTrainerPage'
import FitnessProgramsPage from './pages/admin/FitnessProgramsPage'
import AddFitnessProgramPage from './pages/admin/AddFitnessProgramPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOutPage />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },

    ]
  }, {
    path: "/admin",
    element: <AdminLayOutPage />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "adduser", element: <AddUserPage /> },
      { path: "adduser/:id", element: <AddUserPage /> },
      { path: "users", element: <UserListPage /> },
      { path: "trainers", element: <ManageTrainerPage /> },
      { path: "fitness", element: <FitnessProgramsPage /> },
      { path: "addfitness", element: <AddFitnessProgramPage /> }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
