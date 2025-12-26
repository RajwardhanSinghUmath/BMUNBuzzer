"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [queue, setQueue] = useState([]);

  // Load queue from Supabase
  async function loadQueue() {
    const { data } = await supabase
      .from("buzz_queue")
      .select("*")
      .order("timestamp", { ascending: true });

    setQueue(data || []);
  }

  useEffect(() => {
    loadQueue();

    // Realtime subscription
    const channel = supabase
      .channel("buzz-queue")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buzz_queue" },
        () => loadQueue()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function resetQueue() {
    await fetch("/api/buzzer/reset", { method: "POST" });
  }

  async function removeUser(userId) {
    await fetch("/api/buzzer/remove", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <button onClick={resetQueue} style={{ marginRight: 10 }}>
        Reset Queue
      </button>

      <h2>Current Queue</h2>
      <ol>
        {queue.map((u) => (
          <li key={u.user_id}>
            {u.name}{" "}
            <button
              onClick={() => removeUser(u.user_id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
