import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../../components/HeroSection';
import About from '../../components/About';
import Qualities from '../../components/Qualities';
import WhoAreWe from '../../components/WhoAreWe';
import Team from '../../components/Team';
import Reservation from '../../components/Reservation';
import Footer from '../../components/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to reservation section
    if (location.state && location.state.scrollToReservation) {
      // Wait a bit for the page to load
      setTimeout(() => {
        const element = document.getElementById('reservation');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <About />
      <Qualities />
      <WhoAreWe />
      <Team />
      <Reservation />
      <Footer />
    </>
  );
};

export default Home;