import { Link } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";


function Navbar() {
        return (
        <nav className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 mb-8">
            <Link
                to="/"
                className="w-full md:w-auto flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-colors duration-200"
            >
                <Home size={20} />
                <span>Início</span>
            </Link>
            <Link
                to="/vestibulares"
                className="w-full md:w-auto flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-colors duration-200"
            >
                <BookOpen size={20} />
                <span>Vestibulares</span>
            </Link>
            <Link
                to="/pas"
                className="w-full md:w-auto flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold text-gray-300 hover:bg-gray-600 transition-colors duration-200"
            >
                <BookOpen size={20} />
                <span>PAS</span>
            </Link>
        </nav>
    );
}

export default Navbar;