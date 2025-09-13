<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use App\Services\NoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class NoteController extends Controller
{
    use AuthorizesRequests;

    protected NoteService $noteService;

    public function __construct(NoteService $noteService)
    {
        $this->noteService = $noteService;
    }

    public function index(): JsonResponse
    {
        $user = Auth::user();

        $personalNotes = $user->notes;
        $sharedNotes = $this->noteService->getSharedNotes($user->id);
        $publicNotes = $this->noteService->getPublicNotes();

        return response()->json([
            'personal_notes' => $personalNotes,
            'shared_notes' => $sharedNotes,
            'public_notes' => $publicNotes
        ]);
    }

    public function store(StoreNoteRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();

        $note = $this->noteService->createNote($validated);

        return response()->json($note, 201);
    }

    public function show(Note $note): JsonResponse
    {
        // Manual authorization check
        $this->authorize('view', $note);

        $note->load('user', 'comments.user', 'sharedUsers');
        return response()->json($note);
    }

    public function update(UpdateNoteRequest $request, Note $note): JsonResponse
    {
        // Manual authorization check
        $this->authorize('update', $note);

        $this->noteService->updateNote($note->id, $request->validated());
        return response()->json($note->fresh());
    }

    public function destroy(Note $note): JsonResponse
    {
        // Manual authorization check
        $this->authorize('delete', $note);

        $this->noteService->deleteNote($note->id);
        return response()->json(null, 204);
    }

    public function share(Request $request, Note $note): JsonResponse
    {
        // Manual authorization check
        $this->authorize('share', $note);

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $this->noteService->shareNote($note->id, $request->user_id);

        return response()->json(['message' => 'Note shared successfully']);
    }

    public function unshare(Request $request, Note $note): JsonResponse
    {
        // Manual authorization check
        $this->authorize('share', $note);

        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $this->noteService->unshareNote($note->id, $request->user_id);

        return response()->json(['message' => 'Note unshared successfully']);
    }
}
