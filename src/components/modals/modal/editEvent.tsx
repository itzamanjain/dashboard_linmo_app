"use client"

type EditEventModalProps = {
    handleEdit: (type: 'one' | 'all' | null) => void;
    onCancel: () => void
    isOpen: boolean;
    onClose?: () => void
}

export default function EditEventModal({ isOpen,handleEdit,onClose}: EditEventModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-black p-6 rounded-3xl w-[90%] max-w-sm text-center text-white overflow-hidden">
                {/* Green curved accent */}

                {/* Content */}
                <div className="relative z-10">
                    {/* Icon at the top */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#c0d000] p-3 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-1">Edit Event</h2>
                    <p className="text-sm text-gray-400 mb-5">Do you want to edit this event?</p>

                    <div className="space-y-3">
                        {/* This event only button */}
                        <button
                            onClick={() => handleEdit('one')}
                            className="w-full flex items-center justify-between bg-[#1a1a1a] hover:bg-[#252525] p-3 rounded-xl border border-[#333333]"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#c0d000] p-2 rounded-md">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-left font-medium">This event only</span>
                                    <span className="text-xs text-gray-400">Edit just on this event</span>
                                </div>

                            </div>

                        </button>

                        {/* This and following events button */}
                        <button
                            onClick={() => handleEdit('all')}
                            className="w-full flex items-center justify-between bg-[#1a1a1a] hover:bg-[#252525] p-3 rounded-xl border border-[#333333]"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="bg-[#c0d000] p-2 rounded-md">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-left font-medium">This and following events</span>
                                    <span className="text-xs text-gray-400">will edit all the following events</span>
                                </div>

                            </div>

                        </button>
                    </div>

                    {/* Cancel button */}
                    <button
                        onClick={onClose}
                        className="mt-5 py-3 w-full text-sm text-white bg-[#1a1a1a] hover:bg-[#252525] rounded-xl border border-[#333333]"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
