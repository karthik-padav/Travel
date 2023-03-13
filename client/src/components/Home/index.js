'use client';


import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  useEffect(()=>{
    const loc = navigator.geolocation.getCurrentPosition((p)=>{

      console.log(p.coords.longitude)
      console.log(p.coords.latitude)
      
    })
  },[])
  return (
    <>
    <section>
        <div className="relative h-screen flex justify-center items-center">
          <div className="z-10 relative">

          <h1 className="text-white font-bold uppercase text-7xl">Right Diversion</h1>
          </div>
        <Image
            src="/images/banner.jpg"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <Image
            src="/images/clouds.png"
            layout="fill"
            objectFit="cover"
            quality={100}
          />


        </div>
    </section>

<section>
    {/* <NearbyLocation/> */}
</section>
    </>
  );
}
