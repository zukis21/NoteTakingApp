<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo users
        $user1 = User::create([
            'name' => 'User 1',
            'email' => 'user1@example.com',
            'password' => Hash::make('password123'),
        ]);

        $user2 = User::create([
            'name' => 'User 2',
            'email' => 'user2@example.com',
            'password' => Hash::make('password123'),
        ]);

        $user3 = User::create([
            'name' => 'User 3',
            'email' => 'user3@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Create notes for user1
        $note1 = Note::create([
            'user_id' => $user1->id,
            'title' => 'Catatan Pertama',
            'content' => 'Ini catatan pertama aku, isinya cuma coba-coba aja.',
            'is_public' => true,
        ]);

        $note2 = Note::create([
            'user_id' => $user1->id,
            'title' => 'Curhatan Pribadi',
            'content' => 'Hari ini agak capek sih, semoga besok lebih enak.',
            'is_public' => false,
        ]);

        // Create notes for user2
        $note3 = Note::create([
            'user_id' => $user2->id,
            'title' => 'Daftar Belanja',
            'content' => "- Susu\n- Telur\n- Roti\n- Kopi biar nggak ngantuk",
            'is_public' => true,
        ]);

        // Share notes between users
        $note1->sharedUsers()->attach($user2->id);
        $note3->sharedUsers()->attach($user1->id);

        // Create comments
        Comment::create([
            'user_id' => $user2->id,
            'note_id' => $note1->id,
            'content' => 'Wkwk seru juga catatannya, lanjutkan bro'
        ]);

        Comment::create([
            'user_id' => $user1->id,
            'note_id' => $note3->id,
            'content' => 'Eh, aku juga perlu belanja ini besok'
        ]);
    }
}
