<?php

namespace App\Interfaces;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;

interface NoteRepositoryInterface
{
    public function getAllNotes(): Collection;
    public function getNoteById(int $noteId): ?Note;
    public function createNote(array $noteDetails): Note;
    public function updateNote(int $noteId, array $noteDetails): bool;
    public function deleteNote(int $noteId): bool;
    public function getSharedNotes(int $userId): Collection;
    public function getPublicNotes(): Collection;
    public function shareNote(int $noteId, int $userId): void;
    public function unshareNote(int $noteId, int $userId): void;
}
