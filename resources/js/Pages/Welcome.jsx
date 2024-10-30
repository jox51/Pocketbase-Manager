import { Head, Link } from "@inertiajs/react";
import Logo from "../../assets/logo.svg";
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
                        <Link
                            href="/docs"
                            className="text-white hover:text-gray-200"
                        >
                            Documentation
                        </Link>
                        <Link
                            href="https://github.com/your-repo"
                            className="text-white hover:text-gray-200"
                        >
                            GitHub
                        </Link>

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

            {/* Hero Section */}
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl font-bold text-gray-800 mb-6">
                            Manage Multiple Pocketbase Instances
                        </h1>
                        <p className="text-xl text-gray-600 mb-10">
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
                                href="/docs"
                                className="border-2 border-[#7FB3D5] text-[#7FB3D5] hover:bg-gray-50 px-8 py-3 rounded-md font-medium"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="text-[#7FB3D5] text-2xl mb-4">
                                ⚡
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Centralized Management
                            </h3>
                            <p className="text-gray-600">
                                Manage all your Pocketbase instances from a
                                single dashboard, streamlining your workflow and
                                saving time.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="text-[#7FB3D5] text-2xl mb-4">
                                🌐
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Remote Access
                            </h3>
                            <p className="text-gray-600">
                                Access and control your Pocketbase instances
                                from anywhere, ensuring you're always connected
                                to your data.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="text-[#7FB3D5] text-2xl mb-4">
                                🐳
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Easy Deployment
                            </h3>
                            <p className="text-gray-600">
                                Quick and seamless deployment using Coolify with
                                our provided Dockerfile. Get up and running in
                                minutes with just a few clicks.
                            </p>
                        </div>
                    </div>

                    {/* Get Involved & Stay Updated Sections */}
                    <div className="bg-gray-100 py-20">
                        <div className="container mx-auto px-4">
                            <div className="grid md:grid-cols-2 gap-16">
                                {/* Get Involved Section */}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                        Get Involved
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Pocketbase Manager is an open-source
                                        project. We welcome contributions from
                                        the community!
                                    </p>
                                    <Link
                                        href="https://github.com/your-repo"
                                        className="inline-flex items-center space-x-2 bg-white border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        <span>View on GitHub</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
