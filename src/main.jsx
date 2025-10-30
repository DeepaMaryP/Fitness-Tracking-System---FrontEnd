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
import AddFoodMasterPage from './pages/trainer/AddFoodMasterPage'
import ManageFoodMasterList from './pages/trainer/ManageFoodMasterList'
import AddWorkOutPlanPage from './pages/trainer/AddWorkOutPlanPage'
import ManageWorkoutPlanListPage from './pages/trainer/ManageWorkoutPlanListPage'
import AddDietPlanPage from './pages/trainer/AddDietPlanPage'
import ManageDietPlanListPage from './pages/trainer/ManageDietPlanListPage'
import TrainerLayOutPage from './pages/trainer/TrainerLayOutPage'
import TrainerDashBoardPage from './pages/trainer/TrainerDashBoardPage'
import AssignTrainerToUserPage from './pages/admin/AssignTrainerToUserPage'
import ManageTrainerAssignmentPage from './pages/admin/ManageTrainerAssignmentPage'
import UserLayOutPage from './pages/user/UserLayOutPage'
import UserDashboardPage from './pages/user/UserDashboardPage'
import UserProfilePage from './pages/user/UserProfilePage'
import TargetGoalPage from './pages/user/TargetGoalPage'
import MealTrackerHistoryPage from './pages/user/MealTrackerHistoryPage'
import BodyMeasurementsPage from './pages/user/BodyMeasurementsPage'
import BodyMeasurementsProgress from './pages/user/BodyMeasurementsProgress'
import WorkoutTrackerPage from './pages/user/WorkoutTrackerPage '
import AddExerciseMasterPage from './pages/trainer/AddExerciseMasterPage'
import ManageExerciseMasterList from './pages/trainer/ManageExerciseMasterList'
import UserDetailsPage from './pages/trainer/UserDetailsPage'
import UserMealTrackerForTrainer from './pages/trainer/UserMealTrackerForTrainer'
import WorkOutTracketHistoryPage from './pages/user/WorkOutTrackerHistoryPage'
import WorkoutPlanView from './components/user/WorkOutPlanView'
import DietPlanView from './components/user/DietPlanView'
import TrainerProfilePage from './pages/trainer/TrainerProfilePage'
import PaymentPlansPage from './pages/PaymentPlansPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOutPage />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "paymentplan", element: <PaymentPlansPage /> },


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
      { path: "assignments", element: <ManageTrainerAssignmentPage /> },
      { path: "assigntrainer/:userid", element: <AssignTrainerToUserPage /> },
      { path: "assigntrainer", element: <AssignTrainerToUserPage /> },
      { path: "fitness", element: <FitnessProgramListPage /> },
      { path: "addfitness", element: <AddFitnessProgramPage /> },
      { path: "addfitness/:id", element: <AddFitnessProgramPage /> },
    ]
  },
  , {
    path: "/trainer",
    element: <TrainerLayOutPage />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <TrainerDashBoardPage /> },
      { path: "foodmaster", element: <ManageFoodMasterList /> },
      { path: "profile", element: <TrainerProfilePage /> },
      { path: "addfoodmaster", element: <AddFoodMasterPage /> },
      { path: "addfoodmaster/:id", element: <AddFoodMasterPage /> },
      { path: "exercisemaster", element: <ManageExerciseMasterList /> },
      { path: "addexercise", element: <AddExerciseMasterPage /> },
      { path: "addexercise/:id", element: <AddExerciseMasterPage /> },
      { path: "workoutplan", element: <ManageWorkoutPlanListPage /> },
      { path: "addworkoutplan", element: <AddWorkOutPlanPage /> },
      { path: "addworkoutplan/:id", element: <AddWorkOutPlanPage /> },
      { path: "dietplan", element: <ManageDietPlanListPage /> },
      { path: "adddietplan", element: <AddDietPlanPage /> },
      { path: "adddietplan/:id", element: <AddDietPlanPage /> },
      { path: "user/:id", element: <UserDetailsPage /> },
      { path: "user/mealtracker/:id", element: <UserMealTrackerForTrainer /> },
    ]
  },
  , {
    path: "/user",
    element: <UserLayOutPage />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <UserDashboardPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "profile/:id", element: <UserProfilePage /> },
      { path: "target", element: <TargetGoalPage /> },
      { path: "target/:id", element: <TargetGoalPage /> },
      { path: "foodhistory", element: <MealTrackerHistoryPage /> },
      { path: "bodymeasurements", element: <BodyMeasurementsPage /> },
      { path: "bodylogs", element: <BodyMeasurementsProgress /> },
      { path: "workout", element: <WorkoutTrackerPage /> },
      { path: "workouthistory", element: <WorkOutTracketHistoryPage /> },
      { path: "userworkoutplanview/:id", element: <WorkoutPlanView /> },
      { path: "userdietplanview/:id", element: <DietPlanView /> },
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
