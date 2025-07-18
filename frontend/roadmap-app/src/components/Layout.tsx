import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserInfo from "./UserInfo";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { email } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-blue-100">
        <Link
          to="/"
          className="text-2xl font-extrabold text-blue-700 hover:text-blue-800 transition duration-200"
        >
          🚀 Roadmap App
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-700 hover:text-blue-600 transition relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </Link>
          ))}

          {email ? (
            <UserInfo />
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 transition relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-blue-800 hover:after:w-full after:transition-all after:duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-700 transition relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-green-700 hover:after:w-full after:transition-all after:duration-300"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-5 py-10">{children}</main>

      {/* Footer */}
      <footer className="bg-blue-100 text-blue-800 border-t border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-sm">
          {/* Brand Info */}
          <div>
            <h3 className="text-lg font-bold mb-2">🚀 Roadmap App</h3>
            <p className="text-gray-700">
              Plan, vote, and collaborate on product ideas. Built for teams and creators.
            </p>
          </div>

          {/* Footer Navigation */}
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="hover:underline hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:underline hover:text-blue-600">
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline hover:text-blue-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials or Contact */}
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Connect</h4>
            <div className="flex gap-3 text-base">
              <a href="#" className="hover:text-blue-600 transition">
                🌐 Website
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                📧 Email
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                🐦 Twitter
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              &copy; {new Date().getFullYear()} Roadmap App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
