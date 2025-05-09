import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/context/AuthContext";
import ComparisonProvider from "./core/context/ComparisonContext";
import "./assets/css/_App.css";
import { AppRouter } from "./core/routes/AppRouter";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
    <ComparisonProvider>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
      </ComparisonProvider>
    </BrowserRouter>
  );
}

export default App;
