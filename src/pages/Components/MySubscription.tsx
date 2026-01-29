
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Services from './Services';
import Portfilo from "./Portfilo";
import ProcessSection from "./ProcessSection";
import TestimonialSection from './TestimonialSection';
import ContactUs from './ContactUs';
import OfferService from "./OfferService";
import MySubscriptions from './MySubscriptions';
import Footer from './Footer';
const MySubscription = () => (
  <div style={{ minHeight: '100vh', background: '#140f1c' }}>
    <Navbar />
    <MySubscriptions />
    <Footer />
  </div>
);
export default MySubscription;
