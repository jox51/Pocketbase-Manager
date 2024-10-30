import React from "react";

const ShutdownModal = ({ showModal, setShowModal, confirmShutdown }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4">Confirm Shutdown</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to shut down all instances? This
                    action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmShutdown}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                    >
                        Shutdown All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShutdownModal;
