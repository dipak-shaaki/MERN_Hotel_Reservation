import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="heroSection" id="heroSection">
      <Navbar />
      <div className="container">
        <div className="hero-content-wrapper">
          <div className="hero-text-content">
            <h1 className="hero-main-title">GOLDEN PALACE</h1>
            <h2 className="hero-subtitle">Exquisite Culinary Experience</h2>
            <p className="hero-description">
              Indulge in a culinary journey where tradition meets innovation.
              Our master chefs craft extraordinary dishes using the finest ingredients
              sourced from local producers and international markets.
            </p>
            <div className="hero-cta-buttons">
              <button className="btn primary-btn" onClick={() => navigate('/menu')}>Explore Menu</button>
              <a href="#reservation" className="btn secondary-btn">Book a Table</a>
            </div>
          </div>
          <div className="hero-image-content">
            <div className="image-grid">
              <img src="/dinner1.jpeg" alt="Delicious Dish" className="main-hero-image" />
              <img src="/dinner2.png" alt="Chef Special" className="secondary-hero-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;