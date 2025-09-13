<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Note $note): JsonResponse
    {
        // Manual authorization check untuk melihat note
        if (!Auth::user()->can('view', $note)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string'
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'note_id' => $note->id,
            'content' => $request->content
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        // Manual authorization check
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(null, 204);
    }
}
