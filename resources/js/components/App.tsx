import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Notes from "./Notes/Notes";
import NoteDetail from "./Notes/NoteDetail";
import Layout from "./Layout/Layout";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "./Auth/ProtectedRoute";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Notes />} />
                    <Route path="notes/:id" element={<NoteDetail />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;
