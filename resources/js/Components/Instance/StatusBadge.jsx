export default function StatusBadge({ status, isStatusChanging }) {
    if (isStatusChanging || status === "updating") {
        return (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <span>Updating...</span>
            </div>
        );
    }

    return (
        <div
            className={`px-4 py-1 rounded-full ${
                status === "running"
                    ? "bg-emerald-100 text-emerald-600"
                    : status === "stopped"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
            }`}
        >
            {status}
        </div>
    );
} 