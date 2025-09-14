import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import EditNoteModal from "./EditNoteModal";
import { Note as NoteType, User, Comment } from "../../types/notes";
import Swal from "sweetalert2";

const NoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [note, setNote] = useState<NoteType | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchNote();
    }, [id]);

    const fetchNote = async () => {
        try {
            const response = await axios.get<NoteType>(`/api/notes/${id}`);
            setNote(response.data);
        } catch (error) {
            console.error("Error fetching note:", error);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        setDeleteLoading(true);
        try {
            await axios.delete(`/api/notes/${id}`);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`/api/notes/${id}/comments`, { content: comment });
            setComment("");
            fetchNote();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-gray-500">Loading note...</div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-red-500">Note not found</div>
            </div>
        );
    }

    const isOwner = currentUser?.id === note.user_id;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                >
                    ← Back to Notes
                </button>

                {isOwner && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                            disabled={deleteLoading}
                        >
                            Edit Note
                        </button>
                        <button
                            onClick={handleDeleteNote}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete Note"}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {note.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <span>By {note.user?.name}</span>
                            <span>•</span>
                            <span>
                                Created:{" "}
                                {new Date(note.created_at).toLocaleDateString()}
                            </span>
                            {note.edited_at && (
                                <>
                                    <span>•</span>
                                    <span className="text-orange-500">
                                        Edited:{" "}
                                        {new Date(
                                            note.edited_at
                                        ).toLocaleDateString()}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            note.is_public
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {note.is_public ? "Public" : "Private"}
                    </span>
                </div>

                <div className="prose max-w-none mb-6">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700">
                        {note.content}
                    </pre>
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">Comments</h2>

                    <form onSubmit={handleAddComment} className="mb-6">
                        <textarea
                            placeholder="Add a comment..."
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                        >
                            Add Comment
                        </button>
                    </form>

                    <div className="space-y-4">
                        {note.comments?.map((comment) => (
                            <div
                                key={comment.id}
                                className="border-b border-gray-200 pb-4"
                            >
                                <p className="text-gray-700 mb-2">
                                    {comment.content}
                                </p>
                                <div className="text-sm text-gray-500">
                                    By {comment.user.name} •{" "}
                                    {new Date(
                                        comment.created_at
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        {(!note.comments || note.comments.length === 0) && (
                            <p className="text-gray-500 text-center py-4">
                                No comments yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditNoteModal
                    note={note}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={fetchNote}
                />
            )}
        </div>
    );
};

export default NoteDetail;
