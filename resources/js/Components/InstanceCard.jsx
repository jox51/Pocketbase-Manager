import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import StatusBadge from "./Instance/StatusBadge";
import InstanceInfo from "./Instance/InstanceInfo";
import ActionButtons from "./Instance/ActionButtons";

export default function InstanceCard({ instance }) {
    const { pocketbaseUrl, statuses } = usePage().props;
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const isSpeedTest = instance.is_speed_test;

    const adminUrl = `${pocketbaseUrl}/${instance.name}/_`;
    const isRunning = instance.status === "running";

    const isAnyInstanceChanging = Object.values(statuses).some(
        (status) => status === "starting"
    );

    const isAnyInstanceUpdating = Object.values(statuses).some(
        (status) => status === "updating"
    );

    const handleInstanceAction = () => {
        if (isAnyInstanceUpdating) {
            return;
        }

        if (instance.status === "running") {
            router.post(
                "/stop-instance",
                { name: instance.name },
                {
                    onStart: () => {
                        setIsStatusChanging(true);
                    },
                    onSuccess: () => {
                        console.log("Instance stopping...");
                        router.reload({
                            onFinish: () => setIsStatusChanging(false),
                        });
                    },
                    onError: (errors) => {
                        console.error("Failed to stop instance:", errors);
                        setIsStatusChanging(false);
                    },
                    preserveScroll: true,
                }
            );
            return;
        }

        if (instance.status === "stopped") {
            router.post(
                "/restart-instance",
                { name: instance.name },
                {
                    onStart: () => {
                        setIsStatusChanging(true);
                    },
                    onSuccess: () => {
                        console.log("Instance restarting...");
                        router.reload({
                            onFinish: () => setIsStatusChanging(false),
                        });
                    },
                    onError: (errors) => {
                        console.error("Failed to restart instance:", errors);
                        setIsStatusChanging(false);
                    },
                    preserveScroll: true,
                }
            );
            return;
        }

        // If not running or stopped, assume it needs to start
        router.post(
            "/start-instance",
            {
                name: instance.name,
            },
            {
                onStart: () => {
                    setIsStatusChanging(true);
                },
                onSuccess: () => {
                    console.log("Instance starting...");
                    router.reload({
                        onFinish: () => setIsStatusChanging(false),
                    });
                },
                onError: (errors) => {
                    console.error("Failed to start instance:", errors);
                    setIsStatusChanging(false);
                },
                preserveScroll: true,
            }
        );
    };

    const handleDelete = () => {
        router.post(
            "/delete-instance",
            {
                name: instance.name,
            },
            {
                onSuccess: () => {
                    console.log("Instance deleted successfully");
                },
                onError: (errors) => {
                    console.error("Failed to delete instance:", errors);
                },
                preserveScroll: true,
            }
        );
    };

    return (
        <div
            className={`bg-white rounded-3xl p-8 shadow-sm max-w-md ${
                isSpeedTest ? "bg-purple-50" : "bg-white"
            }`}
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-medium">{instance.name}</h2>
                </div>
                <StatusBadge
                    status={instance.status}
                    isStatusChanging={isStatusChanging}
                />
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">URL:</span>
                        {isRunning ? (
                            <a
                                href={adminUrl}
                                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Admin UI
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                                Open Admin UI
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Logs:</span>
                        {isRunning ? (
                            <a
                                href={`/instances/${instance.name}/logs`}
                                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Logs
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                                View Logs
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Terminal:</span>
                        {isRunning ? (
                            <a
                                href={`/terminal/${instance.name}`}
                                className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Terminal
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                                Open Terminal
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </span>
                        )}
                    </div>
                </div>

                {isSpeedTest && instance.latest_speed_test && (
                    <div className="bg-purple-100 rounded-lg p-4 mt-4">
                        <h3 className="text-purple-700 font-medium mb-3">
                            Test Results
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-sm text-purple-600">
                                    Records Written
                                </div>
                                <div className="font-medium">
                                    {
                                        instance.latest_speed_test
                                            .successful_records
                                    }{" "}
                                    /{" "}
                                    {
                                        instance.latest_speed_test
                                            .total_records_attempted
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-purple-600">
                                    Total Time
                                </div>
                                <div className="font-medium">
                                    {
                                        instance.latest_speed_test
                                            .total_time_seconds
                                    }
                                    s
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-purple-600">
                                    Records/Second
                                </div>
                                <div className="font-medium">
                                    {
                                        instance.latest_speed_test
                                            .records_per_second
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-purple-600">
                                    Avg Time/Record
                                </div>
                                <div className="font-medium">
                                    {
                                        instance.latest_speed_test
                                            .average_time_per_record_seconds
                                    }
                                    s
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ActionButtons
                instance={instance}
                isAnyInstanceUpdating={isAnyInstanceUpdating}
                onAction={handleInstanceAction}
                onDelete={handleDelete}
            />
        </div>
    );
}
