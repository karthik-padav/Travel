"use client";
import CarouselWrapper from "../CarouselWrapper";
import Image from "next/image";
import { getIpAddress } from "@/utils/getIpDetails";
import { useEffect, useState } from "react";
import { getThingsToDo } from "@/apollo/services";
import Link from "next/link";

export default function NearbyLocation({ list }) {
  return (
    <>
      {list.length > 0 && (
        <CarouselWrapper>
          {list.map((item) => {
            const { location } = { ...item };
            const { uid: district_id, district_name, state } = { ...location };
            const { uid: state_id, state_name, country } = state;
            const { uid: country_id, country_name } = country;

            let redirect = `/details/${item.uid}`;
            if (item.title)
              redirect = `${redirect}+${item.title.replace(/ /g, "+")}`;
            return (
              <div className="pr-1 pb-1 mr-4 h-full" key={item.id}>
                <div className="hover:shadow-md border rounded-lg p-1 h-full">
                  <Link href={redirect}>
                    <div className="h-52 relative rounded-xl overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={item?.image || "/images/placeholder-image.jpg"}
                        alt={item.title}
                      />
                      {/* <Image
                        src={item || "/images/placeholder-image.jpg"}
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        alt=""
                      /> */}
                    </div>
                    <h3 className="pt-1 line-clamp-one font-semibold">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-blue-700">
                    {district_name && district_id && (
                      <span className="mr-1">
                        <Link href="">{district_name},</Link>
                      </span>
                    )}
                    {state_name && state_id && (
                      <span className="mr-1">
                        <Link href="">{state_name},</Link>
                      </span>
                    )}
                    {country_name && country_id && (
                      <Link href="">{country_name}</Link>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </CarouselWrapper>
      )}
    </>
  );
}
