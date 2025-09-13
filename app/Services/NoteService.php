<?php

namespace App\Services;

use App\Interfaces\NoteRepositoryInterface;
use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;

class NoteService
{
    protected NoteRepositoryInterface $noteRepository;

    public function __construct(NoteRepositoryInterface $noteRepository)
    {
        $this->noteRepository = $noteRepository;
    }

    public function getAllNotes(): Collection
    {
        return $this->noteRepository->getAllNotes();
    }

    public function getNoteById(int $noteId): ?Note
    {
        return $this->noteRepository->getNoteById($noteId);
    }

    public function createNote(array $noteDetails): Note
    {
        return $this->noteRepository->createNote($noteDetails);
    }

    public function updateNote(int $noteId, array $noteDetails): bool
    {
        return $this->noteRepository->updateNote($noteId, $noteDetails);
    }

    public function deleteNote(int $noteId): bool
    {
        return $this->noteRepository->deleteNote($noteId);
    }

    public function getSharedNotes(int $userId): Collection
    {
        return $this->noteRepository->getSharedNotes($userId);
    }

    public function getPublicNotes(): Collection
    {
        return $this->noteRepository->getPublicNotes();
    }

    public function shareNote(int $noteId, int $userId): void
    {
        $this->noteRepository->shareNote($noteId, $userId);
    }

    public function unshareNote(int $noteId, int $userId): void
    {
        $this->noteRepository->unshareNote($noteId, $userId);
    }
}
