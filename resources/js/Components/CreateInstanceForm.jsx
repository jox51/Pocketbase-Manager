import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function CreateInstanceForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        port: "8090",
        status: "created", // Default status for new instances
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/create-instance", {
            onSuccess: () => {
                setData({ name: "", port: "8090", status: "created" });
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Create New Instance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Instance Name
                            </label>
                            <div className="relative group">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 ml-1" />
                                <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-12 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                    Instance name must be unique from currently
                                    running instances
                                </span>
                            </div>
                        </div>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) =>
                                setData("name", e.target.value.trim())
                            }
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="My Instance"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Port
                            </label>
                            <div className="relative group">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 ml-1" />
                                <span className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-12 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                    Port must be unique from currently running
                                    instances
                                </span>
                            </div>
                        </div>
                        <input
                            type="number"
                            required
                            minLength={4}
                            value={data.port}
                            onChange={(e) => setData("port", e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                errors.port
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="8090"
                        />
                        {errors.port && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.port}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={processing || !data.name || data.port.length < 4}
                    className={`w-full px-4 py-2 rounded-md ${
                        processing || !data.name || data.port.length < 4
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    {processing ? "Creating..." : "Create Instance"}
                </button>
            </form>
        </div>
    );
}
