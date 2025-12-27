"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

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
    <div className=" relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#5a7d9a] via-[#0a3d62] to-[#001530]">
      <div className="absolute flex justify-center top-0 left-1">
        <Image 
          src="/bclub_logo.png" 
          alt="BMUN Logo" 
          width={100} 
          height={100} 
          className="relative z-20 "
        />
      </div>
      <div className="relative z-10 flex flex-col items-center w-[90%] md:w-[80%] lg:w-[70%] h-3/4 rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-md shadow-2xl">

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs sm:text-sm tracking-widest font-mono text-white/80">
            BUSINESS CLUB
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-opensans drop-shadow-lg">
            Admin <span className="font-extrabold bg-linear-to-b from-white to-[#5a7d9a] bg-clip-text text-transparent">Panel</span>
          </h1>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetQueue}
          className="mb-8 px-8 py-4 rounded-2xl text-lg font-bold text-white
                    bg-red-700 hover:bg-red-600 active:scale-95
                    shadow-[0_15px_35px_rgba(255,0,0,0.35)]
                    transition-all focus:outline-none"
        >
          RESET QUEUE
        </button>

        {/* Queue */}
        <div className="w-full flex justify-center">
          <div className="overflow-y-auto scrollbar-none max-[450px]:-mx-6  min-[450px]:m-0 max-w-none min-[450px]:w-full 
                          min-[450px]:max-w-md max-h-56 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">

            <h2 className="text-lg font-mono tracking-widest text-white/80 mb-4 text-center">
              CURRENT QUEUE
            </h2>

            {queue.length === 0 ? (
              <p className="text-center text-white/50 font-mono text-sm">
                Queue is empty
              </p>
            ) : (
              <ol className="space-y-2">
                {queue.map((u, idx) => (
                  <li
                    key={u.user_id}
                    className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg
                              bg-white/5 border border-white/10 text-white font-mono"
                  >
                    <span className="opacity-70">#{idx + 1}</span>

                    <span className="flex-1 font-semibold truncate text-right">
                      {u.name}
                    </span>

                    <button
                      onClick={() => removeUser(u.user_id)}
                      className="text-xs font-bold text-red-400 hover:text-red-300 transition -my-2 py-2"
                    >
                      REMOVE
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
