import Image from "next/image";
import React from "react";
import { IoCartOutline } from "react-icons/io5";
export default function Hero() {
  return (
    <div className="h-[100vh] bg-zinc-800 w-full md:px-32 ">
      <section className="flex flex-col-2  justify-evenly items-center gap-10  pt-20  h-[75%] w-full">
        <div className="flex-col items-center justify-center flex-wrap p-10">
          <button className="mb-5 bg-[#22324D] border-2 border-solid  flex items-center justify-center px-4 py-2 text-white">
            Sale 70%
          </button>
          <h1 className="text-[38px] md:text-[50px] text-white font-bold">
            An Industrial <br />
            Take On Sweaters
          </h1>
          <p className="pt-3 text-lg md:text-2xl md:w-[75%] text-white text-left ">
            Anyone can beat you but no one can beat your outfit as long as you
            wear Dine outfits.
          </p>
          {/* <IoCartOutline className="w-12 h-8" /> */}
          <button className="mt-5 bg-[#BAC4C8] border-4 border-solid flex items-center justify-center px-4 py-3 text-[#22324D] border-[#22324D] font-bold">
            <IoCartOutline className="w-12 h-8" /> Start Shopping
          </button>
          <hr className="mt-10 opacity-15" />
          <div
            className="flex pt-5
            justify-center items-center gap-5 list-none mb-5"
          >
            <li>
              <Image
                className=""
                src={"/Featured1.webp"}
                alt="image"
                width={100}
                height={100}
              />
            </li>
            <li>
              <Image
                className=""
                src={"/Featured2.webp"}
                alt="image"
                width={100}
                height={100}
              />
            </li>
            <li>
              <Image
                className=""
                src={"/Featured3.webp"}
                alt="image"
                width={100}
                height={100}
              />
            </li>
            <li>
              <Image
                className=""
                src={"/Featured4.png"}
                alt="image"
                width={100}
                height={100}
              />
            </li>
          </div>
        </div>
        <div className="hidden lg:flex">
          <div className="bg-[#4f5252] rounded-full w-[500px]  h-[500px] md:flex items-center justify-center overflow-hidden hidden ">
            <Image
              src={"/event4.png"}
              alt="image"
              width={400}
              height={400}
              className="w-[95%] pt-10 h-auto rounded-full object-"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
