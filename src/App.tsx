import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import { AppRouter } from "./core/routes/AppRouter";
import './assets/css/_App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter> 
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
