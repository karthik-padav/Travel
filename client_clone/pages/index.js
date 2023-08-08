import HomePage from "@/components/Home";
import { Inter } from "next/font/google";
import { getThingsToDo } from "@/apollo/services";
import { gql } from "@apollo/client";
import client from "../apollo/apollo-client";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ thingsToDo = [], states = [] }) {
  const [nearByPlaces, setNearByPlaces] = useState({});

  async function onPageLoad() {
    // let ipAddress = await fetch(
    //   "https://cors-anywhere.herokuapp.com/https://www.trackip.net/ip"
    // );
    if (true) {
      // if (ipAddress.status === 200) {
      // ipAddress = await ipAddress.text();
      // let c_location = await fetch(
      //   `https://cors-anywhere.herokuapp.com/https://ipinfo.io/${ipAddress}/json?token=${process.env.IP_INFO}`
      // );
      // c_location = await c_location.json();
      let c_location = {
        ip: "49.205.36.188",
        hostname: "broadband.actcorp.in",
        city: "Bengaluru",
        region: "Karnataka",
        country: "IN",
        loc: "15.5008938,73.9116272",
        org: "AS24309 Atria Convergence Technologies Pvt. Ltd. Broadband Internet Service Provider INDIA",
        postal: "560002",
        timezone: "Asia/Kolkata",
        readme: "https://ipinfo.io/missingauth",
      };
      const lat = c_location?.loc?.split(",")?.[0];
      const long = c_location?.loc?.split(",")?.[1];
      if (lat && long) {
        const nearBy = await getThingsToDo({
          where: { lat, long, maxDistance: 1000 },
        });
        console.log(nearBy, "nearBy123");
        setNearByPlaces(nearBy);
        console.log(lat, long, "latLong123");
      }
    }
  }

  useEffect(() => {
    onPageLoad();
  }, []);
  return (
    <HomePage
      thingsToDo={thingsToDo}
      nearByPlaces={nearByPlaces}
      states={states}
    />
  );
}

export async function getServerSideProps(context) {
  const thingsToDo = await getThingsToDo();
  let states = await client.query({
    query: gql`
      query lists($limit: Int, $skip: Int, $where: JSON) {
        getStates(limit: $limit, skip: $skip, where: $where) {
          data {
            state_name
            banner_image
            uid
            country {
              uid
              country_name
            }
          }
        }
      }
    `,
    variables: { where: {}, limit: 15, skip: 0 },
  });
  states = states?.data?.getStates?.data || [];
  return { props: { thingsToDo, states } };
}
