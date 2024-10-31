import { Head, Link } from "@inertiajs/react";
import Logo from "../../assets/logo.svg";

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy" />

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center">
                            <img
                                src={Logo}
                                alt="Logo"
                                className="h-16 w-auto"
                            />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="min-h-screen bg-gray-50">
                <div className="py-16">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12">
                                <h1 className="text-4xl font-bold mb-12 text-center">
                                    Privacy Policy
                                </h1>

                                <div className="space-y-12 max-w-4xl mx-auto">
                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Data Collection
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Pocketbase Manager only collects the
                                            minimum information necessary to
                                            provide our service. This includes
                                            your email address for
                                            authentication and basic instance
                                            configuration data.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Data Usage
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We use your data solely for managing
                                            your Pocketbase instances and
                                            improving our service. We do not
                                            sell or share your personal
                                            information with third parties.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Data Storage
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Your instance data is stored
                                            securely and only accessible to you.
                                            We implement industry-standard
                                            security measures to protect your
                                            information.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Cookies
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            We use essential cookies to maintain
                                            your session and preferences. No
                                            tracking or advertising cookies are
                                            used.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Contact
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            If you have any questions about our
                                            privacy policy, please contact us
                                            through our GitHub repository.
                                        </p>
                                    </section>

                                    <section className="pt-8 border-t border-gray-200">
                                        <p className="text-sm text-gray-500 text-center">
                                            Last updated:{" "}
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#2B4964] text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <p>© 2024 Pocketbase Manager</p>
                        <div className="space-x-6">
                            <Link
                                href="/privacy"
                                className="hover:text-gray-300"
                            >
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-gray-300">
                                Terms
                            </Link>
                            <Link
                                href="https://github.com/jox51/pocketbase-manager"
                                className="hover:text-gray-300"
                                target="_blank"
                            >
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
