/**
 * កំណត់ចំណាំ: hook auth
 * ឯកសារ: src/app/auth/useAuth.js
 * ចាស់: ./hooks/useAuth.js
 */
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
