"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateUserId } from "@/lib/generateId";
import Image from "next/image";

export default function UserPage() {
  const [name, setName] = useState();
  const [userId, setUserId] = useState("");
  const [queue, setQueue] = useState([]);
  // const [buzzed, setBuzzed] = useState(false);

  const router = useRouter();

  // Create the ID only once
  useEffect(() => {
    let id = localStorage.getItem("buzzer_user_id");
    if (!id) {
      id = generateUserId();
      localStorage.setItem("buzzer_user_id", id);
    }
    setUserId(id);

    const savedName = localStorage.getItem("buzzer_name");
    if (savedName) setName(savedName);
    else {
      router.replace("/");
      return;
    }

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
    // setQueue(["few", "Ef", "Efw", "Wf", "qde", "rg", "Egeg"])
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
    <div className={`relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#5a7d9a] via-[#0a3d62] to-[#001530]`}>
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
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-xs sm:text-sm tracking-widest font-mono text-white/80">
            BUSINESS CLUB
          </p>
          <h1 className="text-5xl lg:text-6xl text-white font-opensans drop-shadow-lg">
            Buzzer <br className="sm:hidden"/><span className="font-extrabold bg-linear-to-b from-white to-[#5a7d9a] bg-clip-text text-transparent">Arena</span>
          </h1>
        </div>

        {/* Buzzer Button */}
        <button
          onClick={pressBuzzer}
          className="mb-6 sm:mb-12 px-10 py-6 rounded-2xl text-xl font-bold text-white
                    bg-red-600 hover:bg-red-500 active:scale-95
                    shadow-[0_20px_40px_rgba(255,0,0,0.35)]
                    transition-all focus:outline-none"
        >
          PRESS BUZZER
        </button>

        {/* Queue */}
        <div className="w-full flex justify-center items-center ">
          <div className="max-[450px]:-mx-6  min-[450px]:m-0 max-w-none min-[450px]:w-full min-[450px]:max-w-md max-h-56  overflow-y-auto scrollbar-none  bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-mono tracking-widest text-white/80 mb-4 text-center">
              CURRENT QUEUE
            </h2>

            {queue.length === 0 ? (
              <p className="text-center text-white/50 font-mono text-sm">
                No one has buzzed yet
              </p>
            ) : (
              <ol className="space-y-2 ">
                {queue.map((u, idx) => (
                  <li
                    key={u.user_id}
                    className="flex items-center justify-between px-4 py-2 rounded-lg gap-1 overflow-x-scroll scrollbar-none
                              bg-white/5 border border-white/10 text-white font-mono"
                  >
                    <span className="opacity-70">#{idx + 1}</span>
                    <span className="font-semibold">{u.name}</span>
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
