import AppNavbar from "../../core/components/Navbar";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams();

  return (
    <div>
        <AppNavbar />
      <h1>Detalle del alimento con ID: {id}</h1>
    </div>
  );
};

export default DetailPage;