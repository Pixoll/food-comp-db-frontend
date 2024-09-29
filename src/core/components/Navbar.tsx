import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

const AppNavbar = () => {
    return (
        <Navbar className='custom-navbar' expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as = {Link} to = "/users">Users</Nav.Link>
                        <Nav.Link as = {Link} to = "/search"> Search</Nav.Link>
                    </Nav>
                    <NavDropdown title="Information" id="nav-dropdown">
                        <NavDropdown.Item as={Link} to="/nutrients">Nutrients</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
