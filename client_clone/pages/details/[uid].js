import Image from "next/image";
import { Inter } from "next/font/google";
import { gql } from "@apollo/client";
import client from "../../apollo/apollo-client";
import CarouselWrapper from "@/components/CarouselWrapper";
import StarRatings from "react-star-ratings";
import Link from "next/link";
import { getHowToReach, getInfo, getWeather } from "@/utils/common";
import { useEffect, useState } from "react";
import { getThingsToDo } from "@/apollo/services";

const inter = Inter({ subsets: ["latin"] });

export default function Details(props) {
  console.log(props, "props123");
  const [weatherData, setWeatherData] = useState([]);
  const { details, nearByLocation = [] } = { ...props };
  const { gpt } = { ...details };
  const {
    things_to_do = [],
    best_months_to_visit = [],
    railway_station_distance,
    nearest_railway_station,
    nearest_airport,
    how_to_reach_by_bus,
    airport_distance,
    exploration_hours,
    famous_for = [],
    famous_food_to_try = [],
    entry_fee,
  } = { ...gpt };
  const uid = details?.uid;
  const title = details?.title;
  const sub_title_1 = details?.sub_title;
  const sub_title_2 = details?.gmap?.sub_title;
  const description_1 = details?.description;
  const description_2 = details?.gmap?.description;
  const rating = details?.gmap?.rating || details?.ratings;
  const district_id = details?.location?.uid;
  const district_name = details?.location?.district_name;

  const state_id = details?.location?.state?.uid;
  const state_name = details?.location?.state?.state_name;

  const country_id = details?.location?.state?.country?.uid;
  const country_name = details?.location?.state?.country?.country_name;
  const category = details?.gmap?.category;
  const phone = details?.gmap?.phone;
  const website = details?.gmap?.website;
  const gmapURL = details?.gmap?.page_URL;
  const address = details?.gmap?.address;
  const { byAir, byRoad, byTrain } = getHowToReach({
    title,
    railway_station_distance,
    nearest_railway_station,
    nearest_airport,
    how_to_reach_by_bus,
    airport_distance,
  });
  let howToReach = [];
  if (byAir)
    howToReach.push({ icon: "plane.png", title: "By Flight", value: byAir });
  if (byRoad)
    howToReach.push({ icon: "bus.png", title: "By Bus", value: byRoad });
  if (byTrain)
    howToReach.push({ icon: "train.png", title: "By Train", value: byTrain });

  const info = getInfo({ phone, address, gmapURL, website });
  const timings = details?.gmap?.timings || {};

  async function onLoad() {
    const latitude = details?.gmap?.geoJson?.coordinates?.[0];
    const longitude = details?.gmap?.geoJson?.coordinates?.[1];
    if (latitude && longitude) {
      const _weatherData = await getWeather(latitude, longitude);
      if (_weatherData) setWeatherData(_weatherData);
    }
  }

  useEffect(() => {
    onLoad();
  }, [details]);

  if (!uid) return null;
  return (
    <div className="grid my-4 gap-4 px-10 grid-cols-4">
      <div className="col-span-3">
        <div className="grid gap-4 my-4 grid-cols-8">
          <div className="col-span-5">
            <CarouselWrapper show={1}>
              {(details?.images || []).map((item, index) => (
                <div className="h-full" key={item}>
                  <div className="h-96 relative rounded-lg overflow-hidden">
                    <Image
                      className="h-full"
                      src={item || "/images/placeholder-image.jpg"}
                      width={1000}
                      height={1000}
                      quality={100}
                      object-fit="fill"
                      alt={title}
                    />
                  </div>
                </div>
              ))}
            </CarouselWrapper>
          </div>
          <div className="col-span-3">
            {title && <h1 className=" text-3xl mt-4">{title}</h1>}

            {sub_title_1 && <p className="text-sm mt-1">{sub_title_1}</p>}
            {sub_title_2 && <p className="text-sm mt-1">{sub_title_2}</p>}

            {rating && (
              <div className="mt-2">
                <StarRatings
                  rating={Number(rating)}
                  starDimension="30px"
                  starSpacing="3px"
                  starRatedColor="#FF9529"
                />
              </div>
            )}

            <p className="mt-2">
              <span className="mr-1">Located in:</span>
              {district_name && district_id && (
                <span className="text-blue-400 mr-1">
                  <Link
                    href={`/places/${district_id}+place+to+visit+in+${district_name.replace(
                      / /g,
                      "+"
                    )}`}
                  >
                    {district_name},
                  </Link>
                </span>
              )}
              {state_name && state_id && (
                <span className="text-blue-400 mr-1">
                  <Link
                    href={`/places/${state_id}+place+to+visit+in+${state_name.replace(
                      / /g,
                      "+"
                    )}`}
                  >
                    {state_name},
                  </Link>
                </span>
              )}
              {country_name && country_id && (
                <span className="text-blue-400 ">
                  <Link
                    href={`/places/${country_id}+place+to+visit+in+${country_name.replace(
                      / /g,
                      "+"
                    )}`}
                  >
                    {country_name}
                  </Link>
                </span>
              )}
            </p>

            {category && (
              <p className="text-blue-400 my-2">
                <span className="mr-1">
                  <Link href="">{category}</Link>
                </span>
              </p>
            )}
          </div>
        </div>

        {info.length > 0 && (
          <section>
            <div className="grid  gap-4 grid-cols-4">
              {info.map((item, index) => (
                <div key={index} className="col-span-1">
                  <p className="text-blue-400 flex justify-items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        {Object.entries(timings).length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="text-black text-xl mb-2">Timings for {title}:</h2>
            <div className="grid gap-4 grid-cols-4">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((item) => (
                <div key={item}>
                  <p>{item}</p>
                  <p
                    className={
                      timings[item]?.toLowerCase() === "closed"
                        ? "text-red-700"
                        : "text-blue-400"
                    }
                  >
                    {timings[item]}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {weatherData.length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="text-black text-xl mb-2">Weather:</h2>

            <div className="grid  gap-4 grid-cols-4">
              {weatherData.map((item, index) => (
                <div key={index} className="col-span-1 flex items-center">
                  <p className="flex items-center capitalize">
                    <span className="mr-2">{item.title}</span>
                    {item.icon && (
                      <img
                        src={`http://openweathermap.org/img/w/${item.icon}.png`}
                        alt="Weather Icon"
                      />
                    )}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {best_months_to_visit.length > 0 && (
              <p className="mb-2">
                Best month to visit {title} are{" "}
                <span className="">{best_months_to_visit.join(", ")}</span>
              </p>
            )}
          </section>
        )}

        <section>
          <hr className="my-4" />
          <h2 className="text-xl text-black">About {title}:</h2>
          {description_1 && <p className="mt-2">{description_1}</p>}
          {description_2 && <p className="mt-2">{description_2}</p>}

          {exploration_hours && (
            <p className="mt-2 capitalize">
              <span className="">
                Average time taken to explore this place:
              </span>{" "}
              {exploration_hours}
            </p>
          )}
          {entry_fee && (
            <p className="mt-2 capitalize">
              <span className="">Entry fee:</span> {entry_fee}
            </p>
          )}
        </section>

        {howToReach.length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="text-xl text-black">How To Reach {title}:</h2>
            {howToReach.map((item, index) => (
              <div className="flex py-2 items-center" key={index}>
                <img
                  src={`/images/${item.icon}`}
                  className="w-10 h-10 mr-2 mt-2"
                  alt="By Flight"
                />
                <p className="">
                  <span className="">{item.title}:</span> {item.value}
                </p>
              </div>
            ))}
          </section>
        )}

        {things_to_do.length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="text-xl text-black capitalize">
              Things To Do In and around {title}:
            </h2>
            <ol className="list-decimal pl-4">
              {things_to_do.map((item, index) => (
                <li key={index} className="mt-2">
                  {item}
                </li>
              ))}
            </ol>
          </section>
        )}

        {famous_for.length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="text-xl text-black capitalize">
              {title} is famous for:
            </h2>
            <ol className="list-decimal pl-4">
              {famous_for.map((item, index) => (
                <li key={index} className="mt-2">
                  {item}
                </li>
              ))}
            </ol>
          </section>
        )}

        {famous_food_to_try.length > 0 && (
          <section>
            <hr className="my-4" />
            <h2 className="text-xl text-black capitalize">
              Food That You Can Try Near by
            </h2>
            <p>{famous_food_to_try.join(", ")}</p>
          </section>
        )}

        {nearByLocation.length > 0 && (
          <section>
            <hr className="my-4" />
            <h3 className="text-black text-xl mb-2">Similar Places:</h3>
            <CarouselWrapper>
              {nearByLocation.map((item) => {
                const { location } = { ...item };
                const {
                  uid: district_id,
                  district_name,
                  state,
                } = { ...location };
                const { uid: state_id, state_name, country } = state;
                const { uid: country_id, country_name } = country;

                let redirect = `/details/${item.uid}`;
                if (item.title)
                  redirect = `${redirect}+${item.title.replace(/ /g, "+")}`;
                return (
                  <div className="pr-1 pb-1 mr-2 h-full" key={item.id}>
                    <div className="hover:shadow-md border rounded-lg p-1 h-full">
                      <Link href={redirect}>
                        <div className="h-52 relative rounded-lg overflow-hidden">
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
                        <h3 className="pt-1 line-clamp-one ">{item.title}</h3>
                      </Link>
                      <p className="text-blue-400">
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
          </section>
        )}

        {nearByLocation.length > 0 && (
          <section>
            <hr className="my-4" />
            <h3 className="text-black text-xl mb-2">
              Other Top Ranking Places In {district_name}:
            </h3>
            <CarouselWrapper>
              {nearByLocation.map((item) => {
                const { location } = { ...item };
                const {
                  uid: district_id,
                  district_name,
                  state,
                } = { ...location };
                const { uid: state_id, state_name, country } = state;
                const { uid: country_id, country_name } = country;

                let redirect = `/details/${item.uid}`;
                if (item.title)
                  redirect = `${redirect}+${item.title.replace(/ /g, "+")}`;
                return (
                  <div className="pr-1 pb-1 mr-2 h-full" key={item.id}>
                    <div className="hover:shadow-md border rounded-lg p-1 h-full">
                      <Link href={redirect}>
                        <div className="h-52 relative rounded-lg overflow-hidden">
                          {/* <img
                            className="h-full w-full object-cover"
                            src={item?.image || "/images/placeholder-image.jpg"}
                            alt={item.title}
                          /> */}

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
                        <h3 className="pt-1 line-clamp-one ">{item.title}</h3>
                      </Link>
                      <p className="text-blue-400">
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
          </section>
        )}
      </div>

      <aside>
        <h3 className="text-black text-xl">Nearby Places</h3>
        <div className="grid my-4 gap-2 grid-cols-2">
          {nearByLocation.map((item) => {
            let redirect = `/details/${item.uid}`;
            if (item.title)
              redirect = `${redirect}+${item.title.replace(/ /g, "+")}`;
            return (
              <div key={item.id} className="col-span-1">
                <div className="hover:shadow-md border rounded-lg p-1 h-full">
                  <Link href={redirect}>
                    <div className="h-32 relative rounded-lg overflow-hidden">
                      {/* <img
                        className="h-full w-full object-cover"
                        src={item?.image || "/images/placeholder-image.jpg"}
                        alt={item.title}
                      /> */}

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

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        getThingsToDo {
          data {
            uid
          }
        }
      }
    `,
  });
  let paths = (data?.getThingsToDo?.data || []).map((i) => ({
    params: { uid: i.uid },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const uid = context.params.uid?.split("+")?.[0];
  let details = {},
    nearByLocation = [];
  if (uid) {
    console.log(uid, "uid123");
    const { data } = await client.query({
      query: gql`
        query lists($limit: Int, $skip: Int, $where: JSON) {
          getThingsToDo(limit: $limit, skip: $skip, where: $where) {
            data {
              uid
              images
              title
              sub_title
              ratings
              gpt {
                nearest_railway_station
                railway_station_distance
                nearest_airport
                airport_distance
                how_to_reach_by_bus
                things_to_do
                famous_food_to_try
                best_months_to_visit
                famous_for
                entry_fee
                exploration_hours
              }
              location {
                uid
                district_name
                state {
                  uid
                  state_name
                  country {
                    uid
                    country_name
                  }
                }
              }
              review
              description
              gmap {
                title
                sub_title
                description
                rating
                review_count
                timings
                website
                address
                phone
                plus_code
                page_URL
                geoJson
                category
                bannerImage
              }
            }
          }
        }
      `,
      variables: { where: { uid }, limit: 1, skip: 0 },
    });
    details = data?.getThingsToDo?.data?.[0] || {};

    const lat = details?.gmap?.geoJson?.coordinates?.[0];
    const long = details?.gmap?.geoJson?.coordinates?.[1];
    let nearByLocation = [];
    if (long && lat) {
      nearByLocation = await getThingsToDo({
        where: { lat, long, maxDistance: 1000 },
      });
    }
  }
  return { props: { details, nearByLocation } };
}
