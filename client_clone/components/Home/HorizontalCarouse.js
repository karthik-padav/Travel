"use client";
import SwipperWrapper from "@/components/SwipperWrapper";
import Image from "next/image";
import { getIpAddress } from "@/utils/getIpDetails";
import { useEffect, useState } from "react";
import { getThingsToDo } from "@/apollo/services";
import Link from "next/link";
import { generateURL } from "@/utils/common";
import { SwiperSlide } from "swiper/react";

export default function HorizontalCarouse({ list }) {
  return (
    <>
      {list.length > 0 && (
        <SwipperWrapper slidesPerView={3.5}>
          {list.map((item) => {
            const { location } = { ...item };
            const { uid: district_id, district_name, state } = { ...location };
            const { uid: state_id, state_name, country } = state;
            const { uid: country_id, country_name } = country;

            return (
              <SwiperSlide key={item.uid}>
                <div className="pr-1 pb-1 mr-4 h-full">
                  <div className="hover:shadow-md border rounded-lg p-1 h-full">
                    <Link
                      href={generateURL({
                        key: "details",
                        title: item?.title,
                        uid: item.uid,
                      })}
                    >
                      <div className="h-52 relative rounded-xl overflow-hidden">
                        <Image
                          className="h-full"
                          src={item?.image || "/images/placeholder-image.jpg"}
                          width={1000}
                          height={1000}
                          quality={100}
                          object-fit="fill"
                          alt={item.title}
                        />
                      </div>
                      <h3 className="pt-1 line-clamp-one">{item.title}</h3>
                    </Link>
                    <p className="text-blue-400">
                      {district_name && district_id && (
                        <span className="mr-1">
                          <Link
                            href={generateURL({
                              key: "places",
                              uid: district_id,
                              title: district_name,
                            })}
                          >
                            {district_name},
                          </Link>
                        </span>
                      )}
                      {state_name && state_id && (
                        <span className="mr-1">
                          <Link
                            href={generateURL({
                              key: "places",
                              uid: state_id,
                              title: state_name,
                            })}
                          >
                            {state_name},
                          </Link>
                        </span>
                      )}
                      {country_name && country_id && (
                        <Link
                          href={generateURL({
                            key: "places",
                            uid: country_id,
                            title: country_name,
                          })}
                        >
                          {country_name}
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </SwipperWrapper>
      )}
    </>
  );
}
