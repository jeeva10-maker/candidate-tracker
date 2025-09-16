// src/pages/Candidates.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Candidates() {
  const ORG_ID = useMemo(() => import.meta.env.VITE_ORG_ID, []);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [onlyMine, setOnlyMine] = useState(false); // members default true
  const [filterMonth, setFilterMonth] = useState(""); // "YYYY-MM"
  const [query, setQuery] = useState(""); // text search

  // Add form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    month: "",
    notes: "",
    mg1_date: "",
    mg2_date: "",
    bp1_date: "",
    fp1_date: "",
    bp2_date: "",
    fp2_date: "",
    prelaunch_date: "",
    launch_date: "",
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    month: "",
    notes: "",
    mg1_date: "",
    mg2_date: "",
    bp1_date: "",
    fp1_date: "",
    bp2_date: "",
    fp2_date: "",
    prelaunch_date: "",
    launch_date: "",
  });

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data?.user ?? null);

      if (data?.user?.id && ORG_ID) {
        const { data: rows, error: roleErr } = await supabase
          .from("org_members")
          .select("role")
          .eq("org_id", ORG_ID)
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (roleErr && roleErr.code !== "PGRST116") {
          console.error("Failed loading role:", roleErr.message);
        }
        const role = rows?.role || null;
        const admin = role === "owner" || role === "admin";
        setIsAdmin(admin);
        setOnlyMine(!admin); // members default to only mine
      }

      await fetchCandidates();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ORG_ID]);

  async function fetchCandidates() {
    setLoading(true);
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load candidates:", error.message);
      alert(`Failed to load candidates: ${error.message}`);
      setCandidates([]);
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  }

  // ---------- Helpers ----------
  const fmtDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleDateString("en-US"); // MM/DD/YYYY
  };

  const monthToDate = (yyyyMM) => (yyyyMM ? `${yyyyMM}-01` : null);

  const dateInputValue = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const monthInputValue = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 7);
  };

  // ---------- Add ----------
  async function handleAdd(e) {
    e.preventDefault();

    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    if (!currentUser) {
      alert("You must be signed in to add candidates.");
      return;
    }

    const payload = {
      org_id: ORG_ID,
      owner_id: currentUser.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      month: monthToDate(form.month),
      notes: form.notes || null,
      mg1_date: form.mg1_date || null,
      mg2_date: form.mg2_date || null,
      bp1_date: form.bp1_date || null,
      fp1_date: form.fp1_date || null,
      bp2_date: form.bp2_date || null,
      fp2_date: form.fp2_date || null,
      prelaunch_date: form.prelaunch_date || null,
      launch_date: form.launch_date || null,
    };

    const { data, error } = await supabase
      .from("candidates")
      .insert([payload])
      .select();

    if (error) {
      console.error("Error adding candidate:", error.message);
      alert(`Failed to add candidate: ${error.message}`);
      return;
    }

    setCandidates((prev) => (data ? [...data, ...prev] : prev));
    setForm({
      name: "",
      email: "",
      phone: "",
      month: "",
      notes: "",
      mg1_date: "",
      mg2_date: "",
      bp1_date: "",
      fp1_date: "",
      bp2_date: "",
      fp2_date: "",
      prelaunch_date: "",
      launch_date: "",
    });
  }

  // ---------- Edit ----------
  function startEdit(c) {
    setEditingId(c.id);
    setEditForm({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      month: monthInputValue(c.month),
      notes: c.notes || "",
      mg1_date: dateInputValue(c.mg1_date),
      mg2_date: dateInputValue(c.mg2_date),
      bp1_date: dateInputValue(c.bp1_date),
      fp1_date: dateInputValue(c.fp1_date),
      bp2_date: dateInputValue(c.bp2_date),
      fp2_date: dateInputValue(c.fp2_date),
      prelaunch_date: dateInputValue(c.prelaunch_date),
      launch_date: dateInputValue(c.launch_date),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({
      name: "",
      email: "",
      phone: "",
      month: "",
      notes: "",
      mg1_date: "",
      mg2_date: "",
      bp1_date: "",
      fp1_date: "",
      bp2_date: "",
      fp2_date: "",
      prelaunch_date: "",
      launch_date: "",
    });
  }

  function onFormChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onEditChange(e) {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  }

  async function saveEdit(id) {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    if (!currentUser) {
      alert("You must be signed in to update candidates.");
      return;
    }

    const payload = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      month: editForm.month ? monthToDate(editForm.month) : null,
      notes: editForm.notes || null,
      mg1_date: editForm.mg1_date || null,
      mg2_date: editForm.mg2_date || null,
      bp1_date: editForm.bp1_date || null,
      fp1_date: editForm.fp1_date || null,
      bp2_date: editForm.bp2_date || null,
      fp2_date: editForm.fp2_date || null,
      prelaunch_date: editForm.prelaunch_date || null,
      launch_date: editForm.launch_date || null,
    };

    const { data, error } = await supabase
      .from("candidates")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Update error:", error.message);
      alert(`Failed to update: ${error.message}`);
      return;
    }

    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data[0] } : c))
    );
    cancelEdit();
  }

  // ---------- Delete ----------
  async function deleteCandidate(id) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      alert("You must be signed in to delete candidates.");
      return;
    }
    if (!confirm("Delete this candidate?")) return;

    const { error } = await supabase.from("candidates").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      alert(`Failed to delete: ${error.message}`);
      return;
    }

    setCandidates((prev) => prev.filter((c) => c.id !== id));
  }

  // ---------- Client-side filtering + search ----------
  const normalized = (s) => (s || "").toString().toLowerCase();

  const filtered = candidates.filter((c) => {
    // Month filter
    if (filterMonth) {
      const m = c.month ? new Date(c.month) : null;
      const [y, mo] = filterMonth.split("-").map((x) => parseInt(x, 10));
      if (!m || m.getUTCFullYear() !== y || m.getUTCMonth() + 1 !== mo) {
        return false;
      }
    }

    // Only mine
    if (onlyMine && user?.id && c.owner_id !== user.id) return false;

    // Text search across name/email/phone/notes
    if (query.trim()) {
      const q = normalized(query);
      const hay =
        normalized(c.name) +
        " " +
        normalized(c.email) +
        " " +
        normalized(c.phone) +
        " " +
        normalized(c.notes);
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // ---------- CSV export (filtered rows) ----------
  function toCsvValue(v) {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // quote if contains comma, quote, or newline
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function exportCsv() {
    const headers = [
      "name",
      "email",
      "phone",
      "month",
      "mg1_date",
      "mg2_date",
      "bp1_date",
      "fp1_date",
      "bp2_date",
      "fp2_date",
      "prelaunch_date",
      "launch_date",
      "notes",
      "owner_id",
      "org_id",
      "created_at",
      "id",
    ];

    const rows = filtered.map((c) => ({
      ...c,
      month: c.month ? fmtDate(c.month) : "",
      mg1_date: c.mg1_date ? fmtDate(c.mg1_date) : "",
      mg2_date: c.mg2_date ? fmtDate(c.mg2_date) : "",
      bp1_date: c.bp1_date ? fmtDate(c.bp1_date) : "",
      fp1_date: c.fp1_date ? fmtDate(c.fp1_date) : "",
      bp2_date: c.bp2_date ? fmtDate(c.bp2_date) : "",
      fp2_date: c.fp2_date ? fmtDate(c.fp2_date) : "",
      prelaunch_date: c.prelaunch_date ? fmtDate(c.prelaunch_date) : "",
      launch_date: c.launch_date ? fmtDate(c.launch_date) : "",
      created_at: c.created_at ? fmtDate(c.created_at) : "",
    }));

    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((r) => headers.map((h) => toCsvValue(r[h])).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `candidates_${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Render ----------
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Candidates</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="flex items-center gap-2">
          <span className="text-sm">Filter by month:</span>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border p-1 rounded"
            title="Show candidates by month"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm">Search:</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="name, email, phone, notes"
            className="border p-1 rounded w-56"
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
          />
          <span className="text-sm">
            {isAdmin ? "Only my candidates" : "Only my candidates (RLS enforced)"}
          </span>
        </label>

        <button
          onClick={fetchCandidates}
          className="ml-auto bg-gray-100 px-3 py-1 rounded border"
          title="Refresh"
        >
          Refresh
        </button>
        <button
          onClick={exportCsv}
          className="bg-green-600 text-white px-3 py-1 rounded"
          title="Export filtered list as CSV"
        >
          Export CSV
        </button>
      </div>

      {/* Add candidate */}
      <form
        onSubmit={handleAdd}
        className="grid gap-2 grid-cols-1 md:grid-cols-4 xl:grid-cols-6 mb-4"
      >
        <input className="border p-2 rounded" name="name" placeholder="Name (required)" required value={form.name} onChange={onFormChange} />
        <input className="border p-2 rounded" name="email" placeholder="Email" type="email" value={form.email} onChange={onFormChange} />
        <input className="border p-2 rounded" name="phone" placeholder="Phone" value={form.phone} onChange={onFormChange} />
        <input className="border p-2 rounded" name="month" type="month" value={form.month} onChange={onFormChange} title="Choose month (stores 1st of month)" />
        <input className="border p-2 rounded md:col-span-2" name="notes" placeholder="Notes" value={form.notes} onChange={onFormChange} />

        {/* Step dates */}
        <input className="border p-2 rounded" name="mg1_date" type="date" value={form.mg1_date} onChange={onFormChange} placeholder="MG1 date" />
        <input className="border p-2 rounded" name="mg2_date" type="date" value={form.mg2_date} onChange={onFormChange} placeholder="MG2 date" />
        <input className="border p-2 rounded" name="bp1_date" type="date" value={form.bp1_date} onChange={onFormChange} placeholder="BP1 date" />
        <input className="border p-2 rounded" name="fp1_date" type="date" value={form.fp1_date} onChange={onFormChange} placeholder="FP1 date" />
        <input className="border p-2 rounded" name="bp2_date" type="date" value={form.bp2_date} onChange={onFormChange} placeholder="BP2 date (opt)" />
        <input className="border p-2 rounded" name="fp2_date" type="date" value={form.fp2_date} onChange={onFormChange} placeholder="FP2 date (opt)" />
        <input className="border p-2 rounded" name="prelaunch_date" type="date" value={form.prelaunch_date} onChange={onFormChange} placeholder="PreLaunch date" />
        <input className="border p-2 rounded" name="launch_date" type="date" value={form.launch_date} onChange={onFormChange} placeholder="Launch date" />

        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">
          Add
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p>No candidates match your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="border w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Month</th>
                <th className="border p-2 text-left">MG1</th>
                <th className="border p-2 text-left">MG2</th>
                <th className="border p-2 text-left">BP1</th>
                <th className="border p-2 text-left">FP1</th>
                <th className="border p-2 text-left">BP2</th>
                <th className="border p-2 text-left">FP2</th>
                <th className="border p-2 text-left">PreLaunch</th>
                <th className="border p-2 text-left">Launch</th>
                <th className="border p-2 text-left">Notes</th>
                <th className="border p-2 text-left">Created</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const canManage = isAdmin || (user?.id && c.owner_id === user.id);
                const isEditing = editingId === c.id;

                const fmtCell = (value) => (value ? fmtDate(value) : "");

                return (
                  <tr key={c.id}>
                    <td className="border p-2">
                      {isEditing ? (
                        <input className="border p-1 rounded w-full" name="name" value={editForm.name} onChange={onEditChange} required />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="border p-2">
                      {isEditing ? (
                        <input className="border p-1 rounded w-full" name="email" type="email" value={editForm.email} onChange={onEditChange} />
                      ) : (
                        c.email
                      )}
                    </td>
                    <td className="border p-2">
                      {isEditing ? (
                        <input className="border p-1 rounded w-full" name="phone" value={editForm.phone} onChange={onEditChange} />
                      ) : (
                        c.phone
                      )}
                    </td>
                    <td className="border p-2">
                      {isEditing ? (
                        <input className="border p-1 rounded" name="month" type="month" value={editForm.month} onChange={onEditChange} />
                      ) : (
                        fmtDate(c.month)
                      )}
                    </td>

                    {[
                      ["mg1_date", "MG1"],
                      ["mg2_date", "MG2"],
                      ["bp1_date", "BP1"],
                      ["fp1_date", "FP1"],
                      ["bp2_date", "BP2"],
                      ["fp2_date", "FP2"],
                      ["prelaunch_date", "PreLaunch"],
                      ["launch_date", "Launch"],
                    ].map(([field]) => (
                      <td className="border p-2" key={`${c.id}-${field}`}>
                        {isEditing ? (
                          <input
                            className="border p-1 rounded"
                            type="date"
                            name={field}
                            value={editForm[field]}
                            onChange={onEditChange}
                          />
                        ) : (
                          fmtCell(c[field])
                        )}
                      </td>
                    ))}

                    <td className="border p-2">
                      {isEditing ? (
                        <input className="border p-1 rounded w-full" name="notes" value={editForm.notes} onChange={onEditChange} />
                      ) : (
                        c.notes
                      )}
                    </td>
                    <td className="border p-2">{fmtDate(c.created_at)}</td>
                    <td className="border p-2">
                      {canManage ? (
                        isEditing ? (
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(c.id)} className="bg-green-600 text-white px-2 py-1 rounded">
                              Save
                            </button>
                            <button onClick={cancelEdit} className="bg-gray-300 px-2 py-1 rounded">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(c)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                              Edit
                            </button>
                            <button onClick={() => deleteCandidate(c.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                              Delete
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
