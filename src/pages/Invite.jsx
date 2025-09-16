// src/pages/Invite.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // ✅ named import

export default function Invite() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [status, setStatus] = useState("");

  async function handleInvite(e) {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const { error } = await supabase.from("org_invites").insert([
        {
          email,
          role,
          org_id: import.meta.env.VITE_ORG_ID,
        },
      ]);

      if (error) throw error;
      setStatus("Invite sent successfully!");
      setEmail("");
      setRole("member");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Invite</h1>
      <form onSubmit={handleInvite} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Role</label>
          <select
            className="border p-2 w-full rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Invite
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
