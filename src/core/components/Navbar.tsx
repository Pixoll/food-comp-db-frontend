'use client';

import { Languages, LogOut, MonitorCog, Search } from "lucide-react";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const router = useRouter();

  const handleLogout = () => {
    makeRequest("delete", `/admins/${state.username}/session`, {
      token: state.token,
      successCallback: (response) => {
        if (response.data < 400) {
          logout();
          router.push("/");
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

  const NavLink = ({
                     href,
                     children,
                     onClick = undefined
                   }: {
    href?: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    return onClick ? (
        <Nav.Link onClick={onClick}>
          {children}
        </Nav.Link>
    ) : (
        <Nav.Link as={Link} href={href || "#"}>
          {children}
        </Nav.Link>
    );
  };
  return (
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Brand as={Link} href="/">
            {t("navbar.home")}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink href="/search">
                <Search style={{ marginLeft: 20 }} size={40} />
              </NavLink>
              <NavLink href="/comparison">
                Comparar
              </NavLink>
            </Nav>
            <Nav style={{ marginLeft: 20, marginRight: 20 }} className="ms-auto">
              <NavDropdown
                  title={<Languages style={{ marginLeft: 20, marginRight: 20 }} size={40} />}
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
                    <NavLink href="/panel-admin">
                      <MonitorCog style={{ marginLeft: 20, marginRight: 20 }} size={40} />
                    </NavLink>
                    <NavLink onClick={handleLogout}>
                      {t("navbar.close")}
                      <LogOut size={40} />
                    </NavLink>
                  </>
              ) : (
                  <NavLink href="/login">
                    <Image
                        alt="User Icon"
                        width={28}
                        height={28}
                        style={{ marginRight: "5px" }}
                    />
                  </NavLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default AppNavbar;
