import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";

export default function CreateInstanceForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        status: "created", // Default status for new instances
        version: "", // Add version to form data
        download_url: "", // Add download_url to form data
    });

    const [versions, setVersions] = useState([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    console.log({ versions });

    // Fetch PocketBase versions when component mounts
    useEffect(() => {
        let isMounted = true;

        const fetchVersions = async () => {
            if (!isMounted) return;
            setIsLoadingVersions(true);

            try {
                const response = await fetch("/api/pocketbase-versions", {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!isMounted) return;

                // Access the versions array from the response
                setVersions(data.versions);
            } catch (error) {
                if (!isMounted) return;
                console.error("Error fetching PocketBase versions:", error);
                setVersions([]);
            } finally {
                if (!isMounted) return;
                setIsLoadingVersions(false);
            }
        };

        fetchVersions();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleVersionChange = (e) => {
        const selectedVersion = versions.find(
            (v) => v.version === e.target.value
        );
        setData({
            ...data,
            version: selectedVersion?.version || "",
            download_url: selectedVersion?.download_url || "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/create-instance", {
            onSuccess: () => {
                setData({
                    name: "",
                    status: "created",
                    version: "",
                    download_url: "",
                });
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-3">Create New Instance</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
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

                <button
                    type="submit"
                    disabled={processing || !data.name}
                    className={`w-full px-4 py-2 rounded-md ${
                        processing || !data.name
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
