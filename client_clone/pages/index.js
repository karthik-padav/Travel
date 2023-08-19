import HomePage from "@/components/Home";
import { Inter } from "next/font/google";
import { getThingsToDo } from "@/apollo/services";
import { gql } from "@apollo/client";
import client from "../apollo/apollo-client";
import { useEffect, useState } from "react";
import { getLocationList, getMonth } from "@/utils/common";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ states = [], thingsToDoThisMonth = [] }) {
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
          limit: 10,
          where: { lat, long, maxDistance: process?.env?.MAX_DISTANCE },
        });
        setNearByPlaces(nearBy);
      }
    }
  }

  useEffect(() => {
    onPageLoad();
  }, []);

  return (
    <HomePage
      nearByPlaces={nearByPlaces}
      states={states}
      thingsToDoThisMonth={thingsToDoThisMonth}
    />
  );
}

export async function getServerSideProps(context) {
  let promiseResp = [
    // new Promise(async (res) => {
    //   res({
    //     thingsToDoThisMonth: await getThingsToDo({
    //       limit: 10,
    //       where: {
    //         "gpt.best_months_to_visit": { $in: [getMonth()] },
    //       },
    //     }),
    //   });
    // }),

    new Promise(async (res) => {
      res({
        states: await getLocationList({
          key: "country",
          params: { where: {}, limit: 15, skip: 0 },
        }),
      });
    }),
  ];
  promiseResp = await Promise.allSettled(promiseResp);
  promiseResp = promiseResp
    .filter((i) => i.status === "fulfilled")
    .map((i) => i.value);

  return {
    props: {
      ...promiseResp.find((i) => i.thingsToDo),
      ...promiseResp.find((i) => i.states),
      // ...promiseResp.find((i) => i.thingsToDoThisMonth),
    },
  };
}
