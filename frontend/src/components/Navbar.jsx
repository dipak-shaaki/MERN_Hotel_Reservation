import React, { useState } from "react";
import { data } from "../restApi.json";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (e, link, title) => {
    e.preventDefault();

    // If it's the MENU link, navigate to menu page
    if (title === "MENU") {
      navigate('/menu');
      return;
    }

    // If it's the RESERVATION link, scroll to reservation section
    if (title === "RESERVATION") {
      // First navigate to home page if we're not already there
      if (window.location.pathname !== '/') {
        navigate('/', { state: { scrollToReservation: true } });
      } else {
        // If we're already on home page, scroll to reservation
        const element = document.getElementById(link);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // For all other links, navigate to home page
    if (window.location.pathname !== '/') {
      navigate('/');
    } else {
      // If we're already on home page, scroll to section
      const element = document.getElementById(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav>
        <div className="logo">GOLDEN PALACE</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <a
                key={element.id}
                onClick={(e) => handleLinkClick(e, element.link, element.title)}
              >
                {element.title}
              </a>
            ))}
          
          </div>
          <button className="menuBtn" onClick={() => navigate('/menu')}>OUR MENU</button>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;