
import Navbar from '../../pages/Components/Navbar';
/*test */
import HeroSection from '../../pages/Components/HeroSection';
import Services from '../../pages/Components/Services';
import Portfilo from "../../pages/Components/Portfilo";
import ProcessSection from "../../pages/Components/ProcessSection";
import TestimonialSection from '../Components/TestimonialSection';
import ContactUs from '../Components/ContactUs';
import OfferService from "../Components/OfferService";
import ClusterLabCard from '../Components/ClusterLabCard';
import Footer from '../Components/Footer';
import FAQ from '../Components/FAQ';
import HeroVideo from '../Components/HeroVideo';
import StatsSection from '../Components/StatsSection';

import LabPricing from '../Components/LabPricing';
import { HomeMetaTags } from '../../pages/Pages/HomeMetaTags';

// import HomeMetaTag from '../../pages/Pages/HomeMetaTags';

const HomePage = () => (
  <div style={{ minHeight: '100vh', background: '#140f1c' }}>
     <HomeMetaTags />
    <Navbar  />
    <HeroSection />
    <HeroVideo />
    <Services />
    <Portfilo />
    {/* <ClusterLabCard /> */}
    {/* <ProcessSection /> */}
    <OfferService />
    <StatsSection />
    <LabPricing />
    <TestimonialSection />
    <ContactUs />
    <FAQ />
    <Footer />
  </div>
);
export default HomePage;
