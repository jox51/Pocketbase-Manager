import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import InstanceCard from "./InstanceCard";
import CreateInstanceForm from "./CreateInstanceForm";
import ShutdownModal from "./ShutdownModal";
export default function PocketbaseInstances() {
    const [showModal, setShowModal] = useState(false);
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
                {instancesCreated.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                        No instances created yet.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {instancesCreated.map((instance) => (
                            <div key={instance.id} className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] max-w-sm">
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
