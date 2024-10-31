import { Head, Link } from "@inertiajs/react";
import Logo from "../../assets/logo.svg";
import Dashboard from "../../assets/dashboard.png";
import Footer from "@/Components/Footer";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Pocketbase Manager" />

            {/* Navigation */}
            <nav className="bg-[#2B4964] p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img
                            src={Logo}
                            alt="Logo"
                            className="w-auto h-20 invert brightness-0"
                        />
                        {/* <span className="text-white text-xl font-semibold">
                            PocketBase Manager
                        </span> */}
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-white hover:text-gray-200"
                        >
                            Home
                        </Link>
                        {/* <Link
                            href="/docs"
                            className="text-white hover:text-gray-200"
                        >
                            Documentation
                        </Link> */}
                        <a
                            href="https://github.com/jox51/pocketbase-manager"
                            className="text-white hover:text-gray-200"
                            target="_blank"
                        >
                            GitHub
                        </a>

                        {auth.user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-white">
                                    {auth.user.name}
                                </span>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="bg-white text-[#7FB3D5] px-4 py-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route("login")}
                                    className="text-white hover:text-gray-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="bg-white text-[#7FB3D5] px-4 py-2 rounded-md hover:bg-gray-100 transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section with Dashboard Preview */}
            <div className="min-h-screen bg-gradient-to-b from-[#2B4964] to-gray-50">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            Manage Multiple Pocketbase Instances
                        </h1>
                        <p className="text-xl text-gray-100 mb-10">
                            Simplify your database management with our
                            open-source solution
                        </p>
                        <div className="space-x-4">
                            <Link
                                href={
                                    auth.user
                                        ? route("pb-dashboard")
                                        : route("register")
                                }
                                className="bg-[#7FB3D5] hover:bg-[#6FA3C5] text-white px-8 py-3 rounded-md font-medium"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="#features"
                                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="max-w-6xl mx-auto">
                        <div className="relative">
                            {/* Decorative elements */}
                            <div className="absolute -left-4 -top-4 w-72 h-72 bg-[#7FB3D5]/10 rounded-full blur-3xl"></div>
                            <div className="absolute -right-4 -bottom-4 w-72 h-72 bg-[#2B4964]/10 rounded-full blur-3xl"></div>

                            {/* Image Container */}
                            <div className="relative rounded-lg shadow-2xl overflow-hidden border border-gray-200/20 backdrop-blur-sm">
                                <img
                                    src={Dashboard}
                                    alt="Pocketbase Manager Dashboard"
                                    className="w-full h-auto"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2B4964]/10 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Centralized Management */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="text-[#7FB3D5] text-2xl mb-4">⚡</div>
                        <h3 className="text-2xl font-semibold mb-4">
                            Centralized Management
                        </h3>
                        <p className="text-gray-600 text-lg">
                            Manage all your Pocketbase instances from a single
                            dashboard, streamlining your workflow and saving
                            time.
                        </p>
                    </div>

                    {/* Remote Access */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="text-[#7FB3D5] text-2xl mb-4">🌐</div>
                        <h3 className="text-2xl font-semibold mb-4">
                            Remote Access
                        </h3>
                        <p className="text-gray-600 text-lg">
                            Access and control your Pocketbase instances from
                            anywhere, ensuring you're always connected to your
                            data.
                        </p>
                    </div>

                    {/* Easy Deployment */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="text-[#7FB3D5] text-2xl mb-4">🐳</div>
                        <h3 className="text-2xl font-semibold mb-4">
                            Easy Deployment
                        </h3>
                        <p className="text-gray-600 text-lg">
                            Quick and seamless deployment using Coolify with our
                            provided Dockerfile. Get up and running in minutes
                            with just a few clicks.
                        </p>
                    </div>

                    {/* Get Involved */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="text-[#7FB3D5] text-2xl mb-4">👥</div>
                        <h3 className="text-2xl font-semibold mb-4">
                            Get Involved
                        </h3>
                        <p className="text-gray-600 text-lg mb-6">
                            Pocketbase Manager is an open-source project. We
                            welcome contributions from the community!
                        </p>
                        <a
                            href="https://github.com/jox51/pocketbase-manager"
                            className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition"
                            target="_blank"
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>View on GitHub</span>
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
