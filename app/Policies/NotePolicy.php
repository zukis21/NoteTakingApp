<?php

namespace App\Policies;

use App\Models\Note;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Note $note)
    {
        return $note->user_id == $user->id ||
            $note->is_public ||
            $note->sharedUsers->contains($user->id);
    }

    public function update(User $user, Note $note)
    {
        return $note->user_id == $user->id;
    }

    public function delete(User $user, Note $note)
    {
        return $note->user_id == $user->id;
    }

    public function share(User $user, Note $note)
    {
        return $note->user_id == $user->id;
    }
}
