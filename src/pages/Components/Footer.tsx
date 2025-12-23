import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import logoimg from "../../../public/assets/orllogo.png";
import Message from "../MessagesList";
const Footer = () => {
  return (
    <footer className="bg-[#17122A] text-white py-12 px-6 md:px-16 lg:px-24">
    <Message/>
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-700 pb-10 text-center md:text-left">
        {/* Logo + Description */}
        <div>
          <div className="flex justify-center md:justify-start mb-4">
  <div className="bg-white p-2 rounded-xl inline-flex items-center justify-center shadow-md">
    <img
      src={logoimg}
      alt="OnRequestLab"
      width={180}
      height={100}
      className="object-contain"
    />
  </div>
</div>


          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto md:mx-0">
            Affordable and hands-on Red Hat Linux training created by industry
            experts.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-3">
  {[
    {
      Icon: Facebook,
      link: "https://www.facebook.com/people/Onrequestlab/100071258415666/",
    },
    
    {
      Icon: Instagram,
      link: "https://www.instagram.com/onrequestlab/",
    },
    {
      Icon: Linkedin,
      link: "https://www.linkedin.com/company/onrequestlab/",
    },
    {
      Icon: Youtube,
      link: "https://www.youtube.com/@onrequestlab",
    },
  ].map(({ Icon, link }, idx) => (
    <a
      key={idx}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#1a132b] p-2.5 rounded-lg hover:bg-[#7c4dff] transition-colors"
    >
      <Icon className="w-4 h-4 text-white" />
    </a>
  ))}
</div>

        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
           
            <li>
             <a href="#process" className="hover:text-white">
                Process
              </a>
            </li>
            <li>
              <a href="/our-services" className="hover:text-white">
                Our Services
              </a>
            </li>
            <li>
              <a href="/about-us" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="contact-us" className="hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Resources</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
          <li>
             <a href="pricing" className="hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="process" className="hover:text-white">
                Process
              </a>
            </li>
            <li>
              <a href="blogs" className="hover:text-white">
                Blog
              </a>
            </li>
             <li>
              <a href="/assets/pdf/Red Hat Linux Cluster_Glossary.pdf" target="_blank" className="hover:text-white">
                Document
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Help</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="privacy-policy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="terms-and-conditions" className="hover:text-white">
                Terms and Condition
              </a>
            </li>
            <li>
              <a href="feedback" className="hover:text-white">
                Feedback Form
              </a>
            </li>
            <li>
              <a href="#courses" className="hover:text-white">
                Request a Course
              </a>
            </li>
            <li>
              <a href="support" className="hover:text-white">
                Support
              </a>
            </li>
            <li>
              <a href="contact-us" className="hover:text-white">
                Contact Us
              </a>
            </li>
            <li>
              <a href="refund-policy" className="hover:text-white">
                Refund Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-6 text-center">
        <p>© 2025 OnRequestLab. All rights reserved.</p>
        <p className="mt-3 md:mt-0">
          Design By{" "}
          <span className="text-[#A7004C]"><a href="https://cybite.in/" target="_blank">Cybite</a></span> team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
