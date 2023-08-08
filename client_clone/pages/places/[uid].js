import Image from "next/image";
import { Inter } from "next/font/google";
import { gql } from "@apollo/client";
import client from "../../apollo/apollo-client";
import CarouselWrapper from "@/components/CarouselWrapper";
import StarRatings from "react-star-ratings";
import Link from "next/link";
import { Phone, Website, Address } from "@/utils/icons";

const inter = Inter({ subsets: ["latin"] });
const placeholderImage = "/images/placeholder-image.jpg";

export default function Places(props) {
  const { list, nearByLocation = [], uid } = { ...props };
  if (!list?.length) return null;

  let found = list.find(
    (i) =>
      i?.location?.uid === uid ||
      i?.location?.state?.uid === uid ||
      i?.location?.state?.country?.uid === uid
  );
  const banner_image =
    found?.location?.uid === uid
      ? found?.location?.banner_image
      : found?.location?.state?.uid === uid
      ? found?.location?.state?.banner_image
      : found?.location?.state?.country?.uid === uid
      ? found?.location?.state?.country?.banner_image
      : null;
  const title =
    found?.location?.uid === uid
      ? found?.location?.district_name
      : found?.location?.state?.uid === uid
      ? found?.location?.state?.state_name
      : found?.location?.state?.country?.uid === uid
      ? found?.location?.state?.country?.country_name
      : "";
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

        <div className="my-4">
          <h2 className=" text-2xl">Things to do in {title}</h2>
        </div>

        <div className="grid gap-4 my-4 grid-cols-12">
          {list.map((item) => {
            const { location } = { ...item };
            const { uid: district_id, district_name, state } = { ...location };
            const { uid: state_id, state_name, country } = state;
            const { uid: country_id, country_name } = country;
            let redirect = `/details/${item.uid}`;
            if (item.title)
              redirect = `${redirect}+${item.title.replace(/ /g, "+")}`;
            return (
              <div className="col-span-4 pr-1 pb-1 h-full" key={item.id}>
                <div className="hover:shadow-md border rounded-lg p-1 h-full">
                  <Link href={redirect}>
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
                    <h3 className="pt-1 line-clamp-one ">{item.title}</h3>
                  </Link>
                  <p className="capitalize">
                    Located in:{" "}
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
                      <span className="text-blue-400">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside>
        <h3 className=" text-xl">Nearby Places</h3>
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

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        getThingsToDo {
          data {
            location {
              uid
              state {
                uid
                country {
                  uid
                }
              }
            }
          }
        }
      }
    `,
  });
  const paths = [];
  for (const l of data?.getThingsToDo?.data || []) {
    if (l?.location?.uid) paths.push({ params: { uid: l.location.uid } });
    if (l?.location?.state?.uid)
      paths.push({ params: { uid: l.location.state.uid } });
    if (l?.location?.state?.country?.uid)
      paths.push({ params: { uid: l.location.state.country.uid } });
  }

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const uid = context.params.uid?.split("+")?.[0];
  let list = {},
    nearByLocation = [];
  if (uid) {
    const { data } = await client.query({
      query: gql`
        query lists($limit: Int, $skip: Int, $where: JSON) {
          getThingsToDo(limit: $limit, skip: $skip, where: $where) {
            data {
              uid
              image
              title
              location {
                uid
                district_name
                banner_image
                state {
                  uid
                  banner_image
                  state_name
                  country {
                    uid
                    banner_image
                    country_name
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        where: {
          $or: [
            { "location.uid": uid },
            { "location.state.uid": uid },
            { "location.state.country.uid": uid },
          ],
        },
        limit: -1,
        skip: 0,
      },
    });
    list = data?.getThingsToDo?.data || [];

    nearByLocation = await client.query({
      query: gql`
        query lists($limit: Int, $skip: Int, $where: JSON) {
          getThingsToDo(limit: $limit, skip: $skip, where: $where) {
            data {
              uid
              image
              title
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
            }
          }
        }
      `,
      variables: { where: {}, limit: 15, skip: 0 },
    });
    nearByLocation = nearByLocation?.data?.getThingsToDo?.data || [];
  }
  return { props: { list, nearByLocation, uid } };
}
