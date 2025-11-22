import React, { useState } from "react";
import { data } from "../restApi.json";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (e, link) => {
    e.preventDefault();
    if (link === "menu") {
      navigate('/menu');
    } else {
      // For scroll links, let react-scroll handle it
      const element = document.getElementById(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="modern-navbar">
        <div className="logo">GOLDEN PALACE</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <a
                href={element.link === "menu" ? "/menu" : `#${element.link}`}
                key={element.id}
                className="nav-link"
                onClick={(e) => element.link === "menu" ? navigate('/menu') : null}
              >
                {element.title}
              </a>
            ))}
          </div>
          <button className="menuBtn elegant-btn">OUR MENU</button>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;