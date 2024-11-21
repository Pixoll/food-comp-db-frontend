import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link ,useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import loginIcon from '../../assets/images/enter.png';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {

    const { state, logout} = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };
    return (
        <Navbar className='custom-navbar' expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Página Principal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/search">Buscar</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <NavDropdown title="Idiomas" id="nav-dropdown">
                            <NavDropdown.Item>ESPAÑOL</NavDropdown.Item>
                            <NavDropdown.Item>INGLES</NavDropdown.Item>
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
