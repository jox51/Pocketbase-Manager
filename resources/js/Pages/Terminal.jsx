import { usePage } from "@inertiajs/react";
import Terminal from "@/Components/Instance/Terminal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function TerminalPage() {
    const { instance } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Terminal: {instance.name}
                    </h1>
                    <div className="text-sm text-gray-600">
                        Port: {instance.port} | Status: {instance.status}
                    </div>
                </div>
                <Terminal instance={instance} fullScreen />
            </div>
        </AuthenticatedLayout>
    );
}
