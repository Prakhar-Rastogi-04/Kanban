import './App.css';
import Home from './pages/home/Home';
import TaskDetails from './pages/taskDetails/TaskDetails';
import Classification from './pages/classification/Classification';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import AppLayout from './components/appLayout/AppLayout';
// import type { LoaderFunctionArgs } from "react-router-dom";
import {
  Form,
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useActionData,
  useFetcher,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { fakeAuthProvider } from "./utilities/auth";
import { getValFromSession } from './utilities/util';

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      // Our root route always provides the user, if logged in
      return { user: fakeAuthProvider.username };
    },
    errorElement: ErrorElement() ,
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: Home,
        loader: protectedLoader
      },
      {
        path: "login",
        loader: loginLoader,
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "/details/:taskId",
        loader: protectedLoader,
        Component: TaskDetails,
      },
      {
        path: "/classification",
        loader: protectedLoader,
        Component: Classification,
      },
    ]
  }
]);

async function loginLoader() {
  if (getValFromSession('isLoggedin')) {
    return redirect("/");
  }
  return null;
}

async function protectedLoader({request}) {
  if (!getValFromSession('isLoggedin') ) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null
}

function ErrorElement() {
  return (
    <div className='errorElement'>
      <div className='banner'>
      <h2>404 Page not found</h2>
      </div>
    </div>
  )
}

function App() {
  return (
    <div>
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} errorElement={<div>Error Page</div>} />
    </div>
  );
}

export default App;
