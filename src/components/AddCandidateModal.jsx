import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AddCandidateModal({ orgId, userId, onAdded, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mg1Date, setMg1Date] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setName(""); setEmail(""); setPhone(""); setMg1Date(""); setNotes("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !mg1Date) {
      alert("Please enter a name and MG1 date.");
      return;
    }
    setLoading(true);
    try {
      // Other steps are intentionally left null
      const { error } = await supabase.from("candidates").insert([{
        org_id: orgId,
        owner_id: userId,
        name,
        email: email || null,
        phone: phone || null,
        mg1: mg1Date,    // <-- only this step captured on create
        mg2: null,
        bp1: null,
        fp1: null,
        bp2: null,
        fp2: null,
        prelaunch: null,
        launch: null,
        notes: notes || null,
      }]);
      if (error) throw error;
      reset();
      onAdded?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to add candidate: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Candidate</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name *</label>
            <input className="w-full rounded-lg border px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" className="w-full rounded-lg border px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input className="w-full rounded-lg border px-3 py-2" value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">MG1 date *</label>
            <input type="date" className="w-full rounded-lg border px-3 py-2" value={mg1Date} onChange={e=>setMg1Date(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea className="w-full rounded-lg border px-3 py-2" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
            <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}