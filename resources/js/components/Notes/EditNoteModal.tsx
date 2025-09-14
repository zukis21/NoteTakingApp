import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditNoteModalProps {
    note: {
        id: number;
        title: string;
        content: string;
        is_public: boolean;
    };
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
    note,
    isOpen,
    onClose,
    onUpdate,
}) => {
    const [editData, setEditData] = useState({
        title: "",
        content: "",
        is_public: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (note) {
            setEditData({
                title: note.title,
                content: note.content,
                is_public: note.is_public,
            });
        }
    }, [note]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.put(`/api/notes/${note.id}`, editData);
            onUpdate();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update note");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Edit Note</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={editData.title}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter note title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content *
                        </label>
                        <textarea
                            required
                            rows={8}
                            value={editData.content}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    content: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your note content..."
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_public"
                            checked={editData.is_public}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    is_public: e.target.checked,
                                })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="is_public"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Make this note public
                        </label>
                    </div>

                    <div className="flex space-x-3 justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {loading ? "Updating..." : "Update Note"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNoteModal;
