import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

const AppNavbar = () => {
    return (
        <Navbar className='custom-navbar' expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Página Principal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as = {Link} to = "/search">Buscar</Nav.Link>
                    </Nav>

                    <NavDropdown title="Idiomas" id="nav-dropdown"> 
                        <NavDropdown.Item as={Link} to="/nutrients">Nutrients</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Información" id="nav-dropdown">
                        <NavDropdown.Item as={Link} to="/nutrients">Nutrients</NavDropdown.Item>
                    </NavDropdown>




                    
                </Navbar.Collapse>
            </Container>    
        </Navbar>
    );
};

export default AppNavbar;
