import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">ABOUT US</h1>
              <p>Where culinary artistry meets warm hospitality in the heart of Kathmandu.</p>
            </div>
            <p className="mid">
              Welcome to Golden Palace Hotel, where centuries-old culinary traditions blend seamlessly with contemporary innovation. Our award-winning chefs source the finest local and international ingredients to create extraordinary dishes that celebrate both Nepali heritage and global flavors. From intimate dinners to grand celebrations, our dedicated team ensures every guest experiences the pinnacle of fine dining in an atmosphere of refined elegance.
            </p>
           
          </div>
          <div className="banner">
            <img src="about.png" alt="about" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
