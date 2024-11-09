import "../assets/css/_login.css"
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";

const loginPage = () =>{
    return (

        <Container fluid style={{ height: '100vh' } }>
        
        <Row className="login-background h-100 d-flex justify-content-center align-items-center">

        <div className="login-div" >
            <h1>Inicio de sesión</h1>
            <form method="post">
                <div className="txt_field">
                    <input type="text" required />
                    <span></span>
                    <label><FaUserCircle /> Usuario</label>
                </div>
                <div className="txt_field">
                    <input type="password" required />
                    <span></span>
                    <label><FaLock /> Contraseña</label>
                </div>
                <div className="d-flex justify-content-end mb-3">
                    <a href="/forgot-password" style={{ fontSize: '14px', color: '#007bff' }}>¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" className="login-submit">
                    <BiLogIn style={{ marginRight: '8px' }} />
                    Iniciar Sesión
                </button>
            </form>
        </div>

        </Row>
        </Container>
    );
};

export default loginPage;