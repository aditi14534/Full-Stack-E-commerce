import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-300 via-purple-600 to-indigo-900 text-gray-100">
      {/* Bottom Copyright */}
      <div className="border-t border-white/30 py-4 text-center text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">Bluvia</span>. All Rights
        Reserved. | Built by
        <span className="text-pink-200 font-semibold"> Aditi Jain</span>
      </div>
    </footer>
  );
};

export default Footer;
