"use client";
import CarouselWrapper from "../CarouselWrapper";
import Image from "next/image";
import { getIpAddress } from "@/utils/getIpDetails";
import { useEffect, useState } from "react";
import { getThingsToDo } from "@/apollo/services";
import Link from "next/link";

export default function NearbyLocation({list}) {
  return (
    <>
      {list.length > 0 && (
        <CarouselWrapper>
          {list.map((item) => (
            <div className="pr-1 pb-1 mr-2 h-full" key={item.id}>
              <div className="shadow-md p-1 h-full">
                <Link href="">
                  <div className="h-52 relative rounded-lg overflow-hidden">
                    <Image
                      src={item?.gmap?.bannerImage || ""}
                      layout="fill"
                      objectFit="cover"
                      quality={100}
                      alt=""
                    />
                  </div>
                  <h3 className="pt-1 line-clamp-one font-semibold">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-blue-700">
                  {item?.location?.state?.state_name && (
                    <span className="mr-1">
                      <Link href="">{item.location.state.state_name},</Link>
                    </span>
                  )}
                  {item?.location?.district?.district_name && (
                    <Link href="">{item.location.district.district_name}</Link>
                  )}
                </p>
              </div>
            </div>
          ))}
        </CarouselWrapper>
      )}
    </>
  );
}
