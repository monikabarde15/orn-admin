
import Navbar from '../../pages/Components/Navbar';
import HeroSection from '../../pages/Components/HeroSection';
import Services from '../../pages/Components/Services';
import Portfilo from "../../pages/Components/Portfilo";
import ProcessSection from "../../pages/Components/ProcessSection";
import TestimonialSection from '../Components/TestimonialSection';
import ContactUs from '../Components/ContactUs';
import OfferService from "../Components/OfferService";
import ClusterLabCard from '../Components/ClusterLabCard';
import Footer from '../Components/Footer';
const ContactPage = () => (
  <div style={{ minHeight: '100vh', background: '#140f1c' }}>
    <Navbar />
    <ContactUs />
    <Footer />
  </div>
);
export default ContactPage;
