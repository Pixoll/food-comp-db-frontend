import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/context/AuthContext";
import "./assets/css/_App.css";
import { AppRouter } from "./core/routes/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
