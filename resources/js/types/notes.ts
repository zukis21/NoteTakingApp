export interface User {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
}

export interface Comment {
    id: number;
    content: string;
    user: User;
    note_id?: number;
    created_at: string;
    updated_at?: string;
}

export interface Note {
    id: number;
    user_id: number;
    title: string;
    content: string;
    is_public: boolean;
    edited_at: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    shared_users?: User[];
    comments?: Comment[];
}

export interface NotesResponse {
    personal_notes: Note[];
    shared_notes: Note[];
    public_notes: Note[];
}
