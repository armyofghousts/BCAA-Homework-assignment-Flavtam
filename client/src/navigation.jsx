import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import "./place/places.css";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Navbar className="flavtam-navbar" variant="dark" expand={false}>
      <Container>
        <div className="flavtam-navbar-inner">
          <span className="flavtam-brand-text">FlavTam</span>
          <div className="flavtam-nav-links">
            <button
              type="button"
              className={`flavtam-nav-link${
                location.pathname === "/" ? " active" : ""
              }`}
              onClick={() => navigate("/")}
            >
              Místa
            </button>
            <button
              type="button"
              className={`flavtam-nav-link${
                location.pathname === "/categoryList" ? " active" : ""
              }`}
              onClick={() => navigate("/categoryList")}
            >
              Kategorie
            </button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default Navigation;
