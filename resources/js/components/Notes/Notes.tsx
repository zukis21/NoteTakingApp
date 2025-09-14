import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Note, NotesResponse } from "../../types/notes";

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<NotesResponse>({
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
            const response = await axios.get<NotesResponse>("/api/notes");
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
        return (
            <div className="flex justify-center items-center min-h-64">
                Loading notes...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Note
                </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Create New Note
                    </h2>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Title *
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
                                Content *
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
                                className="bg-blue-500 hover:blue-600 text-white px-4 py-2 rounded"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-500 hover:gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Personal Notes
                    </h2>
                    {notes.personal_notes.map((note) => (
                        <NoteCard key={note.id} note={note} type="personal" />
                    ))}
                    {notes.personal_notes.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                            No personal notes yet.
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Shared With Me
                    </h2>
                    {notes.shared_notes.map((note: any) => (
                        <NoteCard key={note.id} note={note} type="shared" />
                    ))}
                    {notes.shared_notes.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                            No shared notes yet.
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Public Notes
                    </h2>
                    {notes.public_notes.map((note: any) => (
                        <NoteCard key={note.id} note={note} type="public" />
                    ))}
                    {notes.public_notes.length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                            No public notes yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface NoteCardProps {
    note: Note;
    type: "personal" | "shared" | "public";
}

const NoteCard: React.FC<NoteCardProps> = ({ note, type }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {note.title}
                </h3>
                {note.edited_at && (
                    <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                        Edited
                    </span>
                )}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {type === "personal" && "Personal"}
                    {type === "shared" && "Shared"}
                    {type === "public" && "Public"}
                    {note.edited_at && " • Edited"}
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
