import React, { useState } from "react";
import { data } from "../restApi.json";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <div className="logo">GOLDEN PALACE</div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            {data[0].navbarLinks.map((element) => (
              <a
                key={element.id}
                onClick={(e) => {
                  e.preventDefault();
                  if (element.title === "RESERVATION") {
                    // For scroll links
                    const elementId = element.link;
                    const targetElement = document.getElementById(elementId);
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    // For other scroll links
                    const elementId = element.link;
                    const targetElement = document.getElementById(elementId);
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                {element.title}
              </a>
            ))}
            <a onClick={(e) => {
              e.preventDefault();
              navigate('/menu');
            }}>
              MENU
            </a>
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