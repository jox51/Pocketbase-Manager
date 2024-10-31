import { Head, Link } from "@inertiajs/react";
import Logo from "../../assets/logo.svg";

export default function Terms() {
    return (
        <>
            <Head title="Terms of Service" />

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
                                    Terms of Service
                                </h1>

                                <div className="space-y-12 max-w-4xl mx-auto">
                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Acceptance of Terms
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            By accessing and using Pocketbase
                                            Manager, you agree to be bound by
                                            these Terms of Service. If you do
                                            not agree to these terms, please do
                                            not use our service.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Use of Service
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Pocketbase Manager is provided as an
                                            open-source tool for managing
                                            Pocketbase instances. You are
                                            responsible for maintaining the
                                            security of your account and any
                                            activities that occur under your
                                            account.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            User Responsibilities
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            You agree to use the service in
                                            compliance with all applicable laws
                                            and regulations. You are responsible
                                            for any data you manage through our
                                            service and ensuring you have the
                                            right to use such data.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Intellectual Property
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Pocketbase Manager is open-source
                                            software licensed under the MIT
                                            license. You are free to use,
                                            modify, and distribute the software
                                            in accordance with the license
                                            terms.
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-semibold mb-6">
                                            Limitation of Liability
                                        </h2>
                                        <p className="text-gray-600 text-lg leading-relaxed">
                                            Pocketbase Manager is provided "as
                                            is" without warranty of any kind. We
                                            are not liable for any damages or
                                            losses related to your use of the
                                            service.
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
