<?php

namespace App\Repositories;

use App\Interfaces\NoteRepositoryInterface;
use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;

class NoteRepository implements NoteRepositoryInterface
{
    public function getAllNotes(): Collection
    {
        return Note::all();
    }

    public function getNoteById(int $noteId): ?Note
    {
        return Note::find($noteId);
    }

    public function createNote(array $noteDetails): Note
    {
        return Note::create($noteDetails);
    }

    public function updateNote(int $noteId, array $noteDetails): bool
    {
        return Note::whereId($noteId)->update($noteDetails);
    }

    public function deleteNote(int $noteId): bool
    {
        return Note::destroy($noteId);
    }

    public function getSharedNotes(int $userId): Collection
    {
        return Note::whereHas('sharedUsers', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();
    }

    public function getPublicNotes(): Collection
    {
        return Note::where('is_public', true)->get();
    }

    public function shareNote(int $noteId, int $userId): void
    {
        $note = Note::find($noteId);
        $note->sharedUsers()->attach($userId);
    }

    public function unshareNote(int $noteId, int $userId): void
    {
        $note = Note::find($noteId);
        $note->sharedUsers()->detach($userId);
    }
}
