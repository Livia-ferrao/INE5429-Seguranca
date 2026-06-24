import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from 'react'
import UserContext from './UserContext'
import { UserProvider } from './UserContext'
import LoggedInContext from "./LoggedInContext";
import {
  AddEstagio,
  Admin,
  AllEstagios,
  DashboardLayout,
  DeleteEstagio,
  EditEstagio,
  Error,
  HomeLayout,
  Login,
  Mensagem,
  Profile,
  Register,
  Inbox,
  UpdateUser
} from './pages'
import Sobre from "./pages/Sobre";


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      // {
      //   index: true,
      //   element: <Landing />,
      //   errorElement: <Error />,
      // },
      {
        index:true,
        path: "",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "login",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "register",
        element: <Register />,
        errorElement: <Error />,
      }]
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <Error />,
    children: [
      {
        index:true,
        path: "all",
        element: <AllEstagios />,
        errorElement: <Error />,
      },
      {
        path: "add",
        element: <AddEstagio />,
        errorElement: <Error />,
      },
      {
        path: "edit/:id",
        element: <EditEstagio />,
        errorElement: <Error />,
      },
      {
        path: "delete/:id",
        element: <DeleteEstagio />,
        errorElement: <Error />,
      },
      {
        path: "inbox",
        element: <Inbox />,
        errorElement: <Error />,
      },
      {
        path: "mensagem",
        element: <Mensagem />,
        errorElement: <Error />,
      },
      {
        path: "profile",
        element: <Profile />,
        errorElement: <Error />,
      },
      {
        path: "sobre",
        element: <Sobre/>,
        errorElement: <Error />,
      },
      {
        path: "atualizar-usuario",
        element: <UpdateUser />,
        errorElement: <Error />,
      },
    ]
    },
    {
      path: "*",
      element: <Error />
    }
  ]
)

const App = () => {
  const [loggado, setLoggado] = useState(false)
  const [user, setUser] = useState(null)
  return (
    <LoggedInContext.Provider value={{loggado, setLoggado}}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </LoggedInContext.Provider>
  );
  // return (
  //   <LoggedInContext.Provider value={{loggado, setLoggado}}>
  //     <UserContext.Provider value={{user, setUser}}>
  //       <RouterProvider router={router} />
  //     </UserContext.Provider>
  //   </LoggedInContext.Provider>
  // );
}

export default App;
