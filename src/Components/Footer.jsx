import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1E293B] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-3xl font-bold tracking-wide text-[#3B82F6]">SponsoSync</h2>
          <p className="mt-4 text-gray-300 leading-relaxed text-base">
            Connecting brands with opportunities. Empowering sponsorships worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-[#3B82F6]">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            <li><a href="/about" className="text-base text-gray-300 hover:text-[#3B82F6] transition">About Us</a></li>
            <li><a href="/services" className="text-base text-gray-300 hover:text-[#3B82F6] transition">Our Services</a></li>
            <li><a href="/contact" className="text-base text-gray-300 hover:text-[#3B82F6] transition">Contact</a></li>
            <li><a href="/faq" className="text-base text-gray-300 hover:text-[#3B82F6] transition">FAQ</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#3B82F6]">Contact Us</h3>
          <div className="mt-4 space-y-3 text-gray-300">
            <p className="flex items-center space-x-3"><FaEnvelope className="text-lg text-[#3B82F6]" /> <span>contact@sponsosync.com</span></p>
            <p className="flex items-center space-x-3"><FaPhone className="text-lg text-[#3B82F6]" /> <span>+91 98765 43210</span></p>
          </div>
        </div>
      </div>

      {/* Stylish Divider */}
      <div className="mt-12 border-t border-[#3B82F6] w-[80%] mx-auto"></div>

      {/* Social Media */}
      <div className="flex justify-center space-x-6 mt-8">
        <a href="#" className="text-2xl text-gray-300 hover:text-[#3B82F6] transition transform hover:scale-110"><FaFacebook /></a>
        <a href="#" className="text-2xl text-gray-300 hover:text-[#3B82F6] transition transform hover:scale-110"><FaTwitter /></a>
        <a href="#" className="text-2xl text-gray-300 hover:text-[#3B82F6] transition transform hover:scale-110"><FaInstagram /></a>
        <a href="#" className="text-2xl text-gray-300 hover:text-[#3B82F6] transition transform hover:scale-110"><FaLinkedin /></a>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400 font-medium mt-8 tracking-wide">
        &copy; {new Date().getFullYear()} SponsoSync. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;