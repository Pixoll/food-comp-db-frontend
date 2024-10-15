import AppNavbar from '../../core/components/Navbar';
import Button from "../../core/components/home/button";
import "../../assets/css/_home.css"; 

const HomePage = () => {
    return (
        <div>
            <AppNavbar />
            <div className="homepage-container">
                <div className="left-content-home">
                    <h1 className="homepage-title">Base de Datos sobre Composición de Alimentos</h1>
                    <p className="homepage-description">
                        Explora los valores nutricionales de alimentos, con datos detallados y actualizados.
                    </p>
                </div>
                <div className="right-content-home">
                    <div className="image-home-container">
                        <img src={require('../../assets/images/image_home.jpg')} alt="Imagen de alimentos" className="right-image" />
                        <div className="overlay">
                            <div className="search-box-home">
                                <h2 className="search-title">Buscar alimento</h2>
                                <Button />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

