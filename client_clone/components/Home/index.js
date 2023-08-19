import Link from "next/link";
import Banner from "./Banner";
import HorizontalCarouse from "./HorizontalCarouse";
import Image from "next/image";
import { generateURL } from "@/utils/common";
import SwipperWrapper from "@/components/SwipperWrapper";
import { SwiperSlide } from "swiper/react";

export default function Home({
  nearByPlaces = [],
  states = [],
  thingsToDoThisMonth = [],
}) {
  const placeholderImage = "/images/placeholder-image.jpg";
  return (
    <>
      <section>
        <Banner />
      </section>

      <div className="grid grid-cols-4">
        <div className="px-10 col-span-3">
          {states.length > 0 && (
            <section className="py-5 pt-10">
              <SwipperWrapper slidesPerView={5.5}>
                {states.map((item) => (
                  <SwiperSlide key={item.uid}>
                    <Link
                      href={generateURL({
                        key: "places",
                        uid: item.uid,
                        title: item.state_name,
                      })}
                    >
                      <div className="text-center">
                        <Image
                          className="w-28 h-28 my-0 mx-auto rounded-full hover:shadow-md border"
                          width={1000}
                          height={1000}
                          quality={100}
                          object-fit="fill"
                          alt={item.state_name}
                          src={item.banner_image || placeholderImage}
                        />
                        <p className="mt-1">{item.state_name}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </SwipperWrapper>
            </section>
          )}

          {nearByPlaces.length > 0 && (
            <section className="py-5 pt-10">
              <h1 className="text-xl text-black mb-2 capitalize">
                Place To Visit Near Me
              </h1>
              <HorizontalCarouse list={nearByPlaces} />
            </section>
          )}

          {thingsToDoThisMonth.length > 0 && (
            <section className="py-5">
              <h1 className="text-xl text-black mb-2 capitalize">
                Places to visit in upcoming months
              </h1>
              <HorizontalCarouse list={thingsToDoThisMonth} />
            </section>
          )}
        </div>
        <aside className="px-10">123123</aside>
      </div>
    </>
  );
}
