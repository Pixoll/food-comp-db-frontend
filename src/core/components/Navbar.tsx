import { Languages, LogOut, MonitorCog, Search } from "lucide-react";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import loginIcon from "../../assets/images/enter.png";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import makeRequest from "../utils/makeRequest";

const AppNavbar = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const { addToast } = useToast();
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    makeRequest("delete", `/admins/${state.username}/session`, {
      token: state.token,
      successCallback: (response) => {
        if (response.data < 400) {
          logout();
          navigate("/");
        }
      },
      errorCallback: (error) => {
        addToast({
          duration: 5000,
          message: error.response?.data?.message || error.message || "Error",
        });
      },
    });
  };

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t("navbar.home")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/search">
              <Search style={{ marginLeft: 20 }} size={40}></Search>
            </Nav.Link>
          </Nav>
          <Nav style={{ marginLeft: 20, marginRight: 20 }} className="ms-auto">
            <NavDropdown
              title={<Languages style={{ marginLeft: 20, marginRight: 20 }} size={40}></Languages>}
              id="nav-dropdown"
            >
              <NavDropdown.Item onClick={() => changeLanguage("es")}>
                {t("navbar.spanish")}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("en")}>
                {t("navbar.english")}
              </NavDropdown.Item>
            </NavDropdown>
            {state.isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/panel-admin">
                  <MonitorCog style={{ marginLeft: 20, marginRight: 20 }} size={40}></MonitorCog>
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  {t("navbar.close")}
                  <LogOut size={40}></LogOut>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                <img
                  src={loginIcon}
                  alt="User Icon"
                  style={{ width: "28px", marginRight: "5px", fill: "#ffffff" }}
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
