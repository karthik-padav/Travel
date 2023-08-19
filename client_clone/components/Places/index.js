import Image from "next/image";
import { Inter } from "next/font/google";
import { gql } from "@apollo/client";
import client from "../../apollo/apollo-client";
import SwipperWrapper from "@/components/SwipperWrapper";
import StarRatings from "react-star-ratings";
import Link from "next/link";
import { Phone, Website, Address } from "@/utils/icons";
import { generateURL } from "@/utils/common";
import { SwiperSlide } from "swiper/react";
const inter = Inter({ subsets: ["latin"] });
const placeholderImage = "/images/placeholder-image.jpg";

export default function Places(props) {
  const { list, nearByLocation = [], uid, locationList = [] } = { ...props };
  console.log(props, "props123");
  if (!list?.length) return null;

  let found = list.find(
    (i) =>
      i?.location?.uid === uid ||
      i?.location?.state?.uid === uid ||
      i?.location?.state?.country?.uid === uid
  );
  let banner_image = "",
    things_to_do = [],
    title = "";
  console.log(found, "found123");
  if (found?.location?.uid === uid) {
    banner_image = found?.location?.banner_image;
    title = found?.location?.district_name;
    things_to_do = found?.location?.things_to_do || [];
  } else if (found?.location?.state?.uid === uid) {
    banner_image = found?.location?.state?.banner_image;
    title = found?.location?.state?.state_name;
    things_to_do = found?.location?.state?.things_to_do || [];
  } else if (found?.location?.state?.country?.uid === uid) {
    banner_image = found?.location?.state?.country?.banner_image;
    title = found?.location?.state?.country?.country_name;
    things_to_do = found?.location?.state?.country?.things_to_do || [];
  }
  const header = title ? `Place to visit in ${title}` : "Place to visit";
  return (
    <div className="grid my-4 gap-4 px-10 grid-cols-4">
      <div className="col-span-3">
        <div className="rounded-lg relative overflow-hidden">
          <div className="absolute text-5xl  text-white py-4 px-2 bottom-0 left-0 capitalize bg-black bg-opacity-30 w-full">
            <h1>{header}</h1>
          </div>
          <Image
            className="h-80 w-full object-cover"
            width={1000}
            height={1000}
            quality={100}
            object-fit="fill"
            alt={header}
            src={banner_image || placeholderImage}
          />
        </div>

        {locationList.length > 0 && (
          <section className="py-5 pt-10">
            <SwipperWrapper slidesPerView={5.5}>
              {locationList.map((item) => (
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
                        alt={
                          item.state_name ||
                          item.country_name ||
                          item.district_name
                        }
                        src={item.banner_image || placeholderImage}
                      />

                      <p className="mt-1">
                        {item.state_name ||
                          item.country_name ||
                          item.district_name}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </SwipperWrapper>
            <hr className="my-4" />
          </section>
        )}

        {things_to_do.length > 0 && (
          <section className="my-4">
            <h2 className=" text-2xl">Things to do in {title}</h2>
            <ul className="list-disc pl-4 grid gap-2 mt-2 grid-cols-2">
              {things_to_do.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <hr className="my-4" />
          </section>
        )}

        <section>
          <h2 className="my-4 text-2xl">Top Attractions in {title}</h2>
          <div className="grid gap-4 my-4 grid-cols-12">
            {console.log(list, "list123")}
            {list.map((item) => {
              const { location } = { ...item };
              const {
                uid: district_id,
                district_name,
                state,
              } = { ...location };
              const { uid: state_id, state_name, country } = state;
              const { uid: country_id, country_name } = country;
              const rating = item?.gmap?.rating || item?.ratings;
              return (
                <div className="col-span-4 pr-1 pb-1 h-full" key={item.id}>
                  <div className="hover:shadow-md border rounded-lg p-1 h-full">
                    <Link
                      href={generateURL({
                        key: "details",
                        uid: item.uid,
                        title: item.title,
                      })}
                    >
                      <div className="relative">
                        <div className="h-52 relative rounded-lg overflow-hidden">
                          <Image
                            className="h-full"
                            width={1000}
                            height={1000}
                            quality={100}
                            object-fit="fill"
                            src={item?.image || placeholderImage}
                            alt={item.title}
                          />
                        </div>
                        {rating && (
                          <div className="mt-2 absolute top-0 right-0">
                            <StarRatings
                              rating={Number(rating)}
                              starDimension="25px"
                              starSpacing="3px"
                              starRatedColor="#FF9529"
                            />
                          </div>
                        )}
                      </div>
                      <h3 className="pt-1 line-clamp-one ">{item.title}</h3>
                    </Link>
                    <p className="capitalize">
                      Located in:{" "}
                      {district_name && district_id && (
                        <span className="text-blue-400 mr-1">
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
                        <span className="text-blue-400 mr-1">
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
                        <span className="text-blue-400">
                          <Link
                            href={generateURL({
                              key: "places",
                              uid: country_id,
                              title: country_name,
                            })}
                          >
                            {country_name}
                          </Link>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <aside>
        <h3 className=" text-xl">Nearby Places</h3>
        <div className="grid my-4 gap-2 grid-cols-2">
          {nearByLocation.map((item) => {
            return (
              <div key={item.id} className="col-span-1">
                <div className="hover:shadow-md border rounded-lg p-1 h-full">
                  <Link
                    href={generateURL({
                      key: "details",
                      uid: item.uid,
                      title: item.title,
                    })}
                  >
                    <div className="h-32 relative rounded-lg overflow-hidden">
                      <Image
                        className="h-full"
                        width={1000}
                        height={1000}
                        quality={100}
                        object-fit="fill"
                        src={item?.image || placeholderImage}
                        alt={item.title}
                      />
                    </div>
                    <p className="pt-1 text-sm line-clamp-one ">{item.title}</p>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
