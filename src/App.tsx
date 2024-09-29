import {router} from "./core/routes/routes"
import './App.css';
import { RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
