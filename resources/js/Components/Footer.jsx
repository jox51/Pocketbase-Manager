import { Link } from "@inertiajs/react";
import Logo from "../../assets/logo.svg";

export default function Footer() {
    return (
        <footer className="bg-[#2B4964] text-white border-t border-gray-700">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Brand and Copyright */}
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="w-auto h-20 invert brightness-0"
                            />
                        </Link>
                    </div>
                    <span className="text-sm text-gray-300">
                        © {new Date().getFullYear()} Pocketbase Manager
                    </span>

                    {/* Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-300 hover:text-white"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-gray-300 hover:text-white"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
