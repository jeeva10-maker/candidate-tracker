import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mg1, setMg1] = useState(null);
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [onlyMyCandidates, setOnlyMyCandidates] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  
  // NEW STATE FOR EDITING
  const [isEditing, setIsEditing] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState({});

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("owner_id");
      if (error) throw error;
      
      const uniqueOwnerIds = [...new Set(data.map(item => item.owner_id))];
      
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', uniqueOwnerIds);

      if (usersError) throw usersError;
      
      const memberList = [{ id: "", email: "All Members" }, ...users];
      setMembers(memberList);

    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      let query = supabase.from("candidates").select(`
        id, created_at, name, email, phone, mg1, mg2, bp1, bp2, fp1, fp2, prelaunch, notes
      `);
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,notes.ilike.%${search}%`);
      }

      if (filterMonth) {
        const [year, month] = filterMonth.split('-');
        const startDate = new Date(year, month - 1, 1).toISOString();
        const nextMonth = parseInt(month, 10);
        const nextMonthYear = parseInt(year, 10);
        const endBoundary = new Date(nextMonthYear, nextMonth, 1).toISOString();
        
        query = query.filter('created_at', 'gte', startDate).filter('created_at', 'lt', endBoundary);
      }
      
      if (onlyMyCandidates) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq("owner_id", user.id);
        }
      }

      if (selectedMember) {
        query = query.eq("owner_id", selectedMember);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCandidates(data);
    } catch (error) {
      alert("Failed to load candidates: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [search, filterMonth, onlyMyCandidates, selectedMember]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required.");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const orgId = import.meta.env.VITE_ORG_ID;

      const payload = {
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        mg1: mg1 || null,
        notes: notes.trim() || null,
        owner_id: user?.id ?? null,
        org_id: orgId
      };

      const { error } = await supabase.from("candidates").insert(payload);
      if (error) throw error;

      setName("");
      setEmail("");
      setPhone("");
      setMg1(null);
      setNotes("");
      fetchCandidates();
    } catch (error) {
      alert("Failed to add candidate: " + error.message);
    }
  };
  
  // NEW EDIT FUNCTIONS
  const handleEdit = (candidate) => {
    setIsEditing(candidate.id);
    setCurrentCandidate(candidate);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("candidates")
        .update(currentCandidate)
        .eq("id", isEditing);

      if (error) throw error;
      
      setIsEditing(null);
      fetchCandidates();
    } catch (error) {
      alert("Failed to update candidate: " + error.message);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setCurrentCandidate({});
  };

  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getMonths = () => {
    const months = [];
    const date = new Date();
    for (let i = -1; i < 12; i++) {
      months.push(
        new Date(date.getFullYear(), date.getMonth() - i, 1).toISOString().slice(0, 7)
      );
    }
    return months;
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Candidates</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Candidate</h2>
        <form onSubmit={handleAdd}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name" className="label">Name (required)</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
            </div>
            <div className="form-field">
              <label htmlFor="email" className="label">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <div className="form-field">
              <label htmlFor="phone" className="label">Phone</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(xxx) xxx-xxxx" />
            </div>
            <div className="form-field">
              <label htmlFor="mg1" className="label">MG1 (date)</label>
              <input type="date" id="mg1" value={mg1 || ""} onChange={(e) => setMg1(e.target.value)} />
            </div>
            <div className="form-field full-width">
              <label htmlFor="notes" className="label">Notes</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any quick notes..."></textarea>
            </div>
            <div className="full-width">
              <button type="submit" className="button-primary">Add Candidate</button>
            </div>
          </div>
        </form>
      </div>

      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Search & Filters</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="search" className="label">Search</label>
            <input type="text" id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, phone, notes" />
          </div>
          <div className="form-field">
            <label htmlFor="filterMonth" className="label">Filter by Month</label>
            <select id="filterMonth" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              {getMonths().map(month => (
                <option key={month} value={month}>{getMonthYear(month)}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="memberFilter" className="label">Filter by Member</label>
            <select id="memberFilter" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.email}</option>
              ))}
            </select>
          </div>
          <div className="form-field checkbox-field">
            <input type="checkbox" id="onlyMyCandidates" checked={onlyMyCandidates} onChange={(e) => setOnlyMyCandidates(e.target.checked)} />
            <label htmlFor="onlyMyCandidates" className="label">Only my candidates</label>
          </div>
          <div className="full-width">
            <button onClick={fetchCandidates} className="button-secondary">Refresh</button>
          </div>
        </div>
      </div>

      <div className="card table-container">
        <h2 className="text-2xl font-semibold mb-4">Candidates List</h2>
        {loading ? (
          <p>Loading candidates...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>MG1</th>
                <th>MG2</th>
                <th>BP1</th>
                <th>BP2</th>
                <th>FP1</th>
                <th>FP2</th>
                <th>PreLaunch</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    {isEditing === candidate.id ? (
                      // EDITABLE ROW
                      <>
                        <td><input type="text" value={currentCandidate.name} onChange={(e) => setCurrentCandidate({ ...currentCandidate, name: e.target.value })} /></td>
                        <td><input type="email" value={currentCandidate.email} onChange={(e) => setCurrentCandidate({ ...currentCandidate, email: e.target.value })} /></td>
                        <td><input type="tel" value={currentCandidate.phone} onChange={(e) => setCurrentCandidate({ ...currentCandidate, phone: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.mg1 || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, mg1: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.mg2 || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, mg2: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.bp1 || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, bp1: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.bp2 || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, bp2: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.fp1 || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, fp1: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.fp2 || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, fp2: e.target.value })} /></td>
                        <td><input type="date" value={currentCandidate.prelaunch || ""} onChange={(e) => setCurrentCandidate({ ...currentCandidate, prelaunch: e.target.value })} /></td>
                        <td><textarea value={currentCandidate.notes} onChange={(e) => setCurrentCandidate({ ...currentCandidate, notes: e.target.value })}></textarea></td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={handleUpdate} className="button-edit">Save</button>
                            <button onClick={handleCancel} className="button-delete">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // STATIC ROW
                      <>
                        <td>{candidate.name}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.phone}</td>
                        <td>{candidate.mg1}</td>
                        <td>{candidate.mg2}</td>
                        <td>{candidate.bp1}</td>
                        <td>{candidate.bp2}</td>
                        <td>{candidate.fp1}</td>
                        <td>{candidate.fp2}</td>
                        <td>{candidate.prelaunch}</td>
                        <td>{candidate.notes}</td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(candidate)} className="button-edit">Edit</button>
                            <button className="button-delete">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center text-gray-500 py-4">No candidates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Candidates;