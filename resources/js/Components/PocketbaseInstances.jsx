import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import InstanceCard from "./InstanceCard";
import CreateInstanceForm from "./CreateInstanceForm";
import ShutdownModal from "./ShutdownModal";
export default function PocketbaseInstances() {
    const [showModal, setShowModal] = useState(false);
    const [isTestingSpeed, setIsTestingSpeed] = useState(false);
    const { instances: instancesCreated, statuses } = usePage().props;

    const handleInstanceAction = (instance) => {
        // Add instance action logic here
    };

    const handleShutdown = () => {
        setShowModal(true);
    };

    const confirmShutdown = () => {
        setShowModal(false);
        router.post(
            "/shutdown-docker",
            {},
            {
                onSuccess: () => {
                    console.log("All instances shut down");
                },
                onError: (errors) => {
                    console.error("Failed to shut down instances:", errors);
                },
            }
        );
    };

    const handleSpeedTest = async () => {
        setIsTestingSpeed(true);
        try {
            const response = await fetch("/speed-test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            });

            const data = await response.json();

            if (data.success) {
                console.log("Speed test results:", data.performance);
                // You might want to show these results in a modal or toast
                console.log(
                    `Wrote ${data.performance.successful_records} records in ${data.performance.total_time_seconds} seconds`
                );
                console.log(
                    `Average time per record: ${data.performance.average_time_per_record_seconds} seconds`
                );
                console.log(
                    `Records per second: ${data.performance.records_per_second}`
                );
            } else {
                console.error("Speed test failed:", data.message);
            }
        } catch (error) {
            console.error("Speed test error:", error);
        } finally {
            setIsTestingSpeed(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Modal */}
            {showModal && (
                <ShutdownModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    confirmShutdown={confirmShutdown}
                />
            )}

            {/* Instance Creation Form */}
            <CreateInstanceForm />

            {/* Instances Container */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center items-center mb-4 space-x-8">
                    <h2 className="text-xl font-semibold">
                        Pocketbase Instances
                    </h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSpeedTest}
                            disabled={isTestingSpeed}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isTestingSpeed ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Running Test...
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Speed Test
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleShutdown}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Shutdown All
                        </button>
                    </div>
                </div>
                {instancesCreated.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                        No instances created yet.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {instancesCreated.map((instance) => (
                            <div
                                key={instance.id}
                                className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] max-w-sm"
                            >
                                <InstanceCard
                                    instance={instance}
                                    onAction={handleInstanceAction}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
