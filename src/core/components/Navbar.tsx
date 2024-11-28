import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link ,useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import loginIcon from '../../assets/images/enter.png';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";

const AppNavbar = () => {
    const { t, i18n } = useTranslation("global");
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    const { state, logout} = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };
    return (
        <Navbar className='custom-navbar' expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">{t('navbar.home')}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/search">{t('navbar.search')}</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                    <NavDropdown title={t('navbar.languages')} id="nav-dropdown">
                        <NavDropdown.Item onClick={() => changeLanguage("es")}>
                                {t('navbar.spanish')}
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => changeLanguage("en")}>
                                {t('navbar.english')}
                            </NavDropdown.Item>
                        </NavDropdown>
                        {state.isAuthenticated ? (
                            <Nav.Link onClick={handleLogout}>
                                Cerrar Sesión
                            </Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                <img
                                    src={loginIcon}
                                    alt="User Icon"
                                    style={{ width: '28px', marginRight: '5px', fill: '#ffffff' }}
                                />
                            </Nav.Link>
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
