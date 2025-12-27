"use client"
import Image from "next/image";
import { CheckIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateUserId } from "@/lib/generateId";

export default function Home() {
  //from-[#1a4b8c] via-[#0d2a52] to-black

  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // ensure userId exists (same logic everywhere)
    let id = localStorage.getItem("buzzer_user_id");
    if (!id) {
      id = generateUserId();
      localStorage.setItem("buzzer_user_id", id);
    }

    // preload name if already saved
    const savedName = localStorage.getItem("buzzer_name");
    if (savedName) {setName(savedName);}
  }, []);

  function saveName() {
    if (!name.trim()) return;
    localStorage.setItem("buzzer_name", name.trim());
    router.replace("/user");

  }

  return (
    <div className=" flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#5a7d9a] via-[#0a3d62] to-[#001530]">
      <div className="relative z-10 flex flex-col justify-between items-center w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] h-3/4 rounded-[40px] border  border-white/10 bg-white/5 p-12 backdrop-blur-md shadow-2xl mx-4">
        <div className="absolute hidden -z-10 md:flex items-center justify-center inset-0 overflow-hidden">
          <Image 
            src="/un.png" 
            alt="UN_emblem" 
            fill
            className="object-contain scale-120 lg:scale-135 xl:scale-150 mask-[linear-gradient(to_bottom,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.5)_100%)]" 
          />
        </div>
        <div className="flex justify-center max-[500px]:pt-6 pt-12 md:pt-10 lg:pt-6">
          <Image 
            src="/bclub_logo.png" 
            alt="BMUN Logo" 
            width={120} 
            height={120} 
            className="relative z-20 "
          />
        </div>
        <div id="main-title" className="absolute inset-0 px-4 pointer-events-none flex justify-center flex-col items-center text-center ">
          <p className="text-xs sm:text-sm md:text-lg font-mono tracking-widest text-white text-shaodw-lg ">BUSINESS CLUB</p>
          <h1 className=" text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white mb-8 tracking-tight text-center font-opensans drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            Welcome to <span className="font-extrabold bg-linear-to-b from-white to-[#5a7d9a] bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">BMUN</span>
          </h1>
        </div>
        <div className="flex gap-4  bg-white/5 border border-[#5a7d9a]/30 text-white font-mono justify-center items-center transition-all shadow-lg rounded-lg max-[500px]:mb-33 mb-37 sm:mb-35 lg:mb-30 xl:mb-26 text-xs sm:text-sm lg:text-base px-2 md:px-4 lg:px-5 py-1.5 lg:py-2 xl:py-2.5 mr-2 ">
          <input placeholder="What shall we call you?" autoFocus onChange={(e) => setName(e.target.value)} value={name}
            className=" font-bold focus:outline-none"/>
          <button className="p-2 -m-2 " onClick={saveName}>
            <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6"/>
          </button>
        </div>
      </div>
    </div>
  );
}
