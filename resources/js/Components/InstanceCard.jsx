import { router, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import StatusBadge from "./Instance/StatusBadge";
import InstanceInfo from "./Instance/InstanceInfo";
import ActionButtons from "./Instance/ActionButtons";

export default function InstanceCard({ instance }) {
    const { pocketbaseUrl, statuses } = usePage().props;
    const [isStatusChanging, setIsStatusChanging] = useState(false);

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
                port: instance.port,
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
                port: instance.port,
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
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-md">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-medium">{instance.name}</h2>
                </div>
                <StatusBadge
                    status={instance.status}
                    isStatusChanging={isStatusChanging}
                />
            </div>

            <InstanceInfo instance={instance} pocketbaseUrl={pocketbaseUrl} />

            <ActionButtons
                instance={instance}
                isAnyInstanceUpdating={isAnyInstanceUpdating}
                onAction={handleInstanceAction}
                onDelete={handleDelete}
            />
        </div>
    );
}
