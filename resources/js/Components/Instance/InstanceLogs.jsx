import { useState, useRef } from "react";
import { router, usePage } from "@inertiajs/react";

export default function InstanceLogs({ fullScreen = false }) {
    const { logs: initialLogs, instance } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");

    const parseLogs = (rawLogs) => {
        return rawLogs
            .map((log) => {
                try {
                    // Extract timestamp and level
                    const timestampMatch = log.match(/\[(.*?)\]/);
                    const levelMatch = log.match(/local\.(.*?):/);

                    if (!timestampMatch || !levelMatch) return null;

                    const timestamp = timestampMatch[1];
                    const level = levelMatch[1];

                    // Extract the JSON message part
                    const messageStart = log.indexOf(": ") + 2;
                    let message;

                    try {
                        // Try to parse as JSON
                        message = JSON.parse(log.substring(messageStart));
                    } catch (jsonError) {
                        // If JSON parsing fails, use the raw message
                        message = {
                            raw: log.substring(messageStart),
                        };
                    }

                    return {
                        timestamp,
                        level,
                        message,
                    };
                } catch (error) {
                    console.error("Error parsing log:", log);
                    return null;
                }
            })
            .filter(Boolean); // Remove any null entries
    };

    const [logs, setLogs] = useState(parseLogs(initialLogs));
    const logsRef = useRef(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filter logs based on search term
    const filteredLogs = logs.filter((log) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            log.timestamp.toLowerCase().includes(searchLower) ||
            log.level.toLowerCase().includes(searchLower) ||
            JSON.stringify(log.message).toLowerCase().includes(searchLower)
        );
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.get(
            `/instances/${instance.name}/logs`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ["logs"],
                onSuccess: () => {
                    setIsRefreshing(false);
                },
                onError: () => {
                    setIsRefreshing(false);
                },
            }
        );
    };

    const getLevelColor = (level) => {
        switch (level.toUpperCase()) {
            case "ERROR":
                return "text-red-500";
            case "WARNING":
                return "text-yellow-500";
            case "INFO":
                return "text-blue-500";
            case "DEBUG":
                return "text-gray-400";
            default:
                return "text-gray-300";
        }
    };

    return (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                Instance Logs : {instance}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {instance.name}
                            </span>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isRefreshing
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <svg
                                className={`-ml-1 mr-2 h-5 w-5 text-gray-500 ${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            {isRefreshing ? "Refreshing..." : "Refresh Logs"}
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Logs Container */}
                <div className="divide-y divide-gray-200">
                    <div
                        ref={logsRef}
                        className={`bg-gray-900 font-mono text-sm overflow-auto
                            ${fullScreen ? "h-[calc(100vh-12rem)]" : "h-96"}
                        `}
                    >
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-gray-500 min-w-[180px] select-all">
                                            {log.timestamp}
                                        </span>
                                        <span
                                            className={`${getLevelColor(
                                                log.level
                                            )} min-w-[70px] uppercase text-xs font-semibold`}
                                        >
                                            {log.level}
                                        </span>
                                        <div className="flex-1">
                                            <pre className="whitespace-pre-wrap break-words text-gray-300">
                                                {typeof log.message === "string"
                                                    ? log.message
                                                    : JSON.stringify(
                                                          log.message,
                                                          null,
                                                          2
                                                      )}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {logs.length === 0
                                    ? "No logs available"
                                    : "No matching logs found"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with stats */}
                <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
                    <div>
                        Showing {filteredLogs.length} of {logs.length} log
                        entries
                    </div>
                    <div className="text-xs">
                        Last refreshed: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
