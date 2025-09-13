import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Comment {
    id: number;
    content: string;
    user: User;
    created_at: string;
}

interface Note {
    id: number;
    title: string;
    content: string;
    is_public: boolean;
    user: User;
    shared_users: User[];
    comments: Comment[];
}

const NoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [shareEmail, setShareEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        content: "",
        is_public: false,
    });

    useEffect(() => {
        fetchNote();
    }, [id]);

    const fetchNote = async () => {
        try {
            const response = await axios.get(`/api/notes/${id}`);
            setNote(response.data);
            setEditData({
                title: response.data.title,
                content: response.data.content,
                is_public: response.data.is_public,
            });
        } catch (error) {
            console.error("Error fetching note:", error);
            navigate("/");
        } finally {
            setLoading(false);
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

    const handleShareNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // First, we need to get the user ID from email
            const usersResponse = await axios.get("/api/users");
            const user = usersResponse.data.find(
                (u: User) => u.email === shareEmail
            );

            if (user) {
                await axios.post(`/api/notes/${id}/share`, {
                    user_id: user.id,
                });
                setShareEmail("");
                fetchNote();
            } else {
                alert("User not found");
            }
        } catch (error) {
            console.error("Error sharing note:", error);
        }
    };

    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/notes/${id}`, editData);
            setIsEditing(false);
            fetchNote();
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleDeleteNote = async () => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                await axios.delete(`/api/notes/${id}`);
                navigate("/");
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading note...</div>;
    }

    if (!note) {
        return <div>Note not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => navigate("/")}
                    className="text-blue-500 hover:text-blue-600"
                >
                    ← Back to Notes
                </button>

                {note.user.id ===
                    parseInt(localStorage.getItem("userId") || "0") && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                            {isEditing ? "Cancel Edit" : "Edit Note"}
                        </button>
                        <button
                            onClick={handleDeleteNote}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Delete Note
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <form
                    onSubmit={handleUpdateNote}
                    className="bg-white p-6 rounded-lg shadow-md space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            value={editData.title}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            required
                            rows={6}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            value={editData.content}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    content: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_public"
                            className="mr-2"
                            checked={editData.is_public}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    is_public: e.target.checked,
                                })
                            }
                        />
                        <label
                            htmlFor="is_public"
                            className="text-sm text-gray-700"
                        >
                            Make public
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Update Note
                    </button>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
                    <p className="text-gray-700 whitespace-pre-wrap mb-6">
                        {note.content}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-6">
                        <span>Created by {note.user.name}</span>
                        <span className="mx-2">•</span>
                        <span>{note.is_public ? "Public" : "Private"}</span>
                    </div>

                    {note.user.id ===
                        parseInt(localStorage.getItem("userId") || "0") && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Share with user
                            </h2>
                            <form
                                onSubmit={handleShareNote}
                                className="flex space-x-2"
                            >
                                <input
                                    type="email"
                                    placeholder="Enter user email"
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                    value={shareEmail}
                                    onChange={(e) =>
                                        setShareEmail(e.target.value)
                                    }
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Share
                                </button>
                            </form>

                            {note.shared_users.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">
                                        Shared with:
                                    </h3>
                                    <ul className="list-disc list-inside">
                                        {note.shared_users.map((user) => (
                                            <li key={user.id}>
                                                {user.name} ({user.email})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Comments</h2>
                        <form onSubmit={handleAddComment} className="mb-6">
                            <textarea
                                placeholder="Add a comment..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Add Comment
                            </button>
                        </form>

                        <div className="space-y-4">
                            {note.comments.map((comment) => (
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

                            {note.comments.length === 0 && (
                                <p className="text-gray-500">
                                    No comments yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteDetail;
