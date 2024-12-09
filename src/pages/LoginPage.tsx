import "../assets/css/_login.css";
import { Container, Row } from 'react-bootstrap';
import { FaUserCircle, FaLock } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import axios from 'axios';
import useForm from "../core/hooks/useForm";
import { useAuth } from "../core/context/AuthContext";
import makeRequest from "../core/utils/makeRequest";

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
    const {t} = useTranslation("global");
    const onLogin = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(t('loginPage.state.request'), `/admins/${formState.username}/session`);
        console.log(t('loginPage.state.send'), {
            password: formState.password,
        });

        makeRequest(
            "post",
            `/admins/${formState.username}/session`,
            {
                password: formState.password,
            },
            null,
            (response) => {
                console.log(t('loginPage.state.Response'), response.data);
                const { token } = response.data;
                dispatch({
                    type: 'LOGIN',
                    payload: { token }
                });
    
                onResetForm();
                navigate('/');
            },
            (error) => {
                console.error(t('loginPage.errors.login'), error);
    
                if (error.response) {
                    console.error(t('loginPage.errors.response'), error.response.data);
                    console.error(t('loginPage.errors.state'), error.response.status);
                } else if (error.request) {
                    console.error(t('loginPage.errors.received'), error.request);
                } else {
                    console.error(t('loginPage.errors.unknown'), error.message);
                }
            }
        );
    };


    return (
        <Container fluid style={{ height: '100vh' }}>
            <Row className="login-background h-100 d-flex justify-content-center align-items-center">
                <div className="login-div" style={{width: '450px'}}>
                    <h1>{t('loginPage.title')}</h1>
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
                            <label><FaUserCircle /> {t('loginPage.username')}</label>
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
                            <label><FaLock /> {t('loginPage.password')}</label>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <a href="/forgot-password" style={{ fontSize: '14px', color: '#ffffff' }}>
                            {t('loginPage.recover')}
                            </a>
                        </div>
                        <button type="submit" className="login-submit">
                            <BiLogIn style={{ marginRight: '8px' }} />
                            {t('loginPage.title')}
                        </button>
                    </form>
                </div>
            </Row>
        </Container>
    );
};

export default LoginPage;
