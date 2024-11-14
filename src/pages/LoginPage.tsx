import "../assets/css/_login.css";
import { Container, Row } from 'react-bootstrap';
import { FaUserCircle, FaLock } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import useForm from "../core/hooks/useForm";
import { useAuth } from "../core/context/AuthContext";

interface LoginForm {
    username: string;
    password: string;
}

const LoginPage = () => {
    const { formState, onInputChange, onResetForm } = useForm<LoginForm>({
        username: "",
        password: ""
    });
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const onLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const url = `http://localhost:3000/api/v1/admins/${formState.username}/session`;

        console.log("Enviando solicitud a:", url);
        console.log("Datos enviados:", {
            password: formState.password,
        });

        axios.post(url, {
            password: formState.password,
        })
        .then((response) => {
            console.log("Respuesta recibida:", response.data);
            const { token } = response.data;
            dispatch({
                type: 'LOGIN',
                payload: { token }
            });

            onResetForm();
            navigate('/');
        })
        .catch((error) => {
            console.error("Error en el inicio de sesión:", error);

            if (error.response) {
                console.error("Respuesta de error:", error.response.data);
                console.error("Codigo de estado:", error.response.status);
            } else if (error.request) {
                console.error("No se recibió respuesta:", error.request);
            } else {
                console.error("Error desconocido:", error.message);
            }
        });
    };


    return (
        <Container fluid style={{ height: '100vh' }}>
            <Row className="login-background h-100 d-flex justify-content-center align-items-center">
                <div className="login-div" style={{width: '450px'}}>
                    <h1>Inicio de sesión</h1>
                    <form onSubmit={onLogin}>
                        <div className="txt_field">
                            <input
                                type="text"
                                name="username"
                                value={formState.username}
                                onChange={onInputChange}
                                required
                            />
                            <span></span>
                            <label><FaUserCircle /> Usuario</label>
                        </div>
                        <div className="txt_field">
                            <input
                                type="password"
                                name="password"
                                value={formState.password}
                                onChange={onInputChange}
                                required
                            />
                            <span></span>
                            <label><FaLock /> Contraseña</label>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <a href="/forgot-password" style={{ fontSize: '14px', color: '#007bff' }}>
                                ¿Olvidaste tu contraseña?
                            </a>
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

export default LoginPage;
