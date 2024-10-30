import PocketbaseInstances from "@/Components/PocketbaseInstances";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function PocketbaseDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pocketbase Manager
                </h2>
            }
        >
            <Head title="Pocketbase Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <PocketbaseInstances />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
