"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateUserId } from "@/lib/generateId";

export default function UserPage() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [queue, setQueue] = useState([]);

  // Create the ID only once
  useEffect(() => {
    let id = localStorage.getItem("buzzer_user_id");
    if (!id) {
      id = generateUserId();
      localStorage.setItem("buzzer_user_id", id);
    }
    setUserId(id);

    loadQueue();

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

  async function loadQueue() {
    const { data } = await supabase
      .from("buzz_queue")
      .select("*")
      .order("timestamp", { ascending: true });

    setQueue(data || []);
  }

  async function pressBuzzer() {
    if (!name.trim()) {
      alert("Enter your name first!");
      return;
    }

    const res = await fetch("/api/buzzer/press", {
      method: "POST",
      body: JSON.stringify({ userId, name })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Already pressed!");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>User Buzzer Page</h1>

      <input
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: 10, marginBottom: 10 }}
      />

      <br />

      <button
        onClick={pressBuzzer}
        style={{ padding: 12, background: "red", color: "white", fontWeight: "bold" }}
      >
        PRESS BUZZER
      </button>

      <h2>Current Queue</h2>
      <ol>
        {queue.map(u => (
          <li key={u.user_id}>
            {u.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
