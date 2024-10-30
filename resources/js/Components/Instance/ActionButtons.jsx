import { Link } from "@inertiajs/react";

export default function ActionButtons({
    instance,
    isAnyInstanceUpdating,
    onAction,
    onDelete,
}) {
    console.log({ instance });
    return (
        <div className="flex gap-3">
            <button
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white ${
                    instance.status === "running"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-emerald-500 hover:bg-emerald-600"
                } ${
                    isAnyInstanceUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onAction}
                disabled={
                    isAnyInstanceUpdating || instance.status === "updating"
                }
            >
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {instance.status === "running" ? (
                        <path d="M6 4h12v16H6V4z" fill="currentColor" />
                    ) : (
                        <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
                    )}
                </svg>
                {instance.status === "running"
                    ? "Stop"
                    : instance.status === "stopped"
                    ? "Restart"
                    : "Start"}
            </button>

            <button
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white ${
                    instance.status !== "stopped" && instance.status !== "created" || isAnyInstanceUpdating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={onDelete}
                disabled={
                    (instance.status !== "stopped" && instance.status !== "created") ||
                    isAnyInstanceUpdating
                }
            >
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Delete
            </button>
        </div>
    );
}
