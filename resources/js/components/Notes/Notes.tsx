import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Note {
    id: number;
    title: string;
    content: string;
    is_public: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<{
        personal_notes: Note[];
        shared_notes: Note[];
        public_notes: Note[];
    }>({
        personal_notes: [],
        shared_notes: [],
        public_notes: [],
    });
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        is_public: false,
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get("/api/notes");
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/notes", newNote);
            setNewNote({ title: "", content: "", is_public: false });
            setShowCreateForm(false);
            fetchNotes();
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    if (loading) {
        return <div>Loading notes...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Notes</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Note
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Create New Note
                    </h2>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                value={newNote.title}
                                onChange={(e) =>
                                    setNewNote({
                                        ...newNote,
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
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                                value={newNote.content}
                                onChange={(e) =>
                                    setNewNote({
                                        ...newNote,
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
                                checked={newNote.is_public}
                                onChange={(e) =>
                                    setNewNote({
                                        ...newNote,
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
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Personal Notes</h2>
                    {notes.personal_notes.map((note) => (
                        <NoteCard key={note.id} note={note} type="personal" />
                    ))}
                    {notes.personal_notes.length === 0 && (
                        <p className="text-gray-500">No personal notes yet.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Shared With Me</h2>
                    {notes.shared_notes.map((note) => (
                        <NoteCard key={note.id} note={note} type="shared" />
                    ))}
                    {notes.shared_notes.length === 0 && (
                        <p className="text-gray-500">No shared notes yet.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Public Notes</h2>
                    {notes.public_notes.map((note) => (
                        <NoteCard key={note.id} note={note} type="public" />
                    ))}
                    {notes.public_notes.length === 0 && (
                        <p className="text-gray-500">No public notes yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const NoteCard: React.FC<{ note: Note; type: string }> = ({ note, type }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {type === "personal" && "Personal"}
                    {type === "shared" && "Shared"}
                    {type === "public" && "Public"}
                </span>
                <Link
                    to={`/notes/${note.id}`}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default Notes;
