import { Facebook, Github, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 flex justify-center gap-7">
        <p className="text-xs leading-5 text-gray-700">
          &copy; 2024 BooksGaleon. All Rights Reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/nikitodeon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github size={24} />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MessageCircle size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Facebook size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
