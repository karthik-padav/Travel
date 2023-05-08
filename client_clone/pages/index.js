import HomePage from "@/components/Home";
import { Inter } from "next/font/google";
import { getThingsToDo } from "@/apollo/services";
import { gql } from "@apollo/client";
import client from "../apollo/apollo-client";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ thingsToDo = [], states = [] }) {
  return <HomePage thingsToDo={thingsToDo} states={states} />;
}

export async function getServerSideProps(context) {
  const thingsToDo = await getThingsToDo();
  let states = await client.query({
    query: gql`
      query lists($limit: Int, $skip: Int, $where: JSON) {
        getStates(limit: $limit, skip: $skip, where: $where) {
          data {
            state_name
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
  console.log(states, "states123");
  states = states?.data?.getStates?.data || [];
  return { props: { thingsToDo, states } };
}
