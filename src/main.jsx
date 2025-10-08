import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import './index.css'
import ErrorPage from './pages/ErrorPage'
import LayOutPage from './pages/LayOutPage'
import Home from './pages/Home'
import AddUserPage from './pages/admin/AddUserPage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLayOutPage from './pages/admin/AdminLayOutPage'
import Login from './pages/auth/Login'
import ManageTrainerPage from './pages/admin/ManageTrainerPage'
import AddFitnessProgramPage from './pages/admin/AddFitnessProgramPage'
import ChangePasswordPage from './pages/admin/UpdatePasswordPage'
import FitnessProgramListPage from './pages/admin/FitnessProgramListPage'
import UserListPage from './pages/admin/ManageUserListPage'
import AddFoodMasterPage from './pages/admin/AddFoodMasterPage'
import ManageFoodMasterList from './pages/admin/ManageFoodMasterList'
import AddWorkOutPlanPage from './pages/trainer/AddWorkOutPlanPage'
import ManageWorkoutPlanListPage from './pages/trainer/ManageWorkoutPlanListPage'
import AddDietPlanPage from './pages/trainer/AddDietPlanPage'
import ManageDietPlanListPage from './pages/trainer/ManageDietPlanListPage'

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
      { path: "changepwd/:id", element: <ChangePasswordPage /> },
      { path: "users", element: <UserListPage /> },
      { path: "trainers", element: <ManageTrainerPage /> },
      { path: "fitness", element: <FitnessProgramListPage /> },
      { path: "addfitness", element: <AddFitnessProgramPage /> },
      { path: "addfitness/:id", element: <AddFitnessProgramPage /> },
      { path: "foodmaster", element: <ManageFoodMasterList /> },
      { path: "addfoodmaster", element: <AddFoodMasterPage /> },
      { path: "addfoodmaster/:id", element: <AddFoodMasterPage /> },

       { path: "workoutplan", element: <ManageWorkoutPlanListPage /> },
      { path: "addworkoutplan", element: <AddWorkOutPlanPage /> },
      { path: "addworkoutplan/:id", element: <AddWorkOutPlanPage /> },
       { path: "dietplan", element: <ManageDietPlanListPage /> },
       { path: "adddietplan", element: <AddDietPlanPage /> },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
       <RouterProvider router={router} />
     </Provider>
  </StrictMode>,
)
