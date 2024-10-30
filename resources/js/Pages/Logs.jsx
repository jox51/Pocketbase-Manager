import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InstanceLogs from "@/Components/Instance/InstanceLogs";

const Logs = () => {
    return (
        <AuthenticatedLayout>
            <InstanceLogs />
        </AuthenticatedLayout>
    );
};

export default Logs;
