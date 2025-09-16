// src/pages/Calendar.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // ✅ named import

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        // Example: fetch from a "calendar" table if you create one
        const { data, error } = await supabase
          .from("calendar")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error("Failed to load events:", err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      {loading ? (
        <p>Loading…</p>
      ) : events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((ev) => (
            <li key={ev.id} className="border p-2 rounded">
              <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleDateString()}
              <p className="text-sm text-gray-600">{ev.notes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
