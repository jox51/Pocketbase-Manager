import { Link } from "@inertiajs/react";

export default function InstanceInfo({ instance, pocketbaseUrl }) {
    return (
        <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M3.6001 9H20.4001M3.6001 15H20.4001"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M12 21C13.6569 21 15 16.9706 15 12C15 7.02944 13.6569 3 12 3C10.3432 3 9 7.02944 9 12C9 16.9706 10.3432 21 12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
                <span>
                    URL:{" "}
                    {instance.status === "running" ? (
                        <a
                            href={`${pocketbaseUrl}/${instance.name}/_`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            {`${pocketbaseUrl}/${instance.name}/_`}
                        </a>
                    ) : (
                        `${pocketbaseUrl}/${instance.name}/_`
                    )}
                </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
                <Link
                    href={`/terminal/${instance.name}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Terminal
                </Link>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
                <Link
                    href={`/instances/${instance.name}/logs`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4zm2 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Logs
                </Link>
            </div>
        </div>
    );
}
