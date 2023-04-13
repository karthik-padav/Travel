import { gql } from "@apollo/client";
import client from "./apollo-client";

export async function getThingsToDo(params) {
  const { data } = await client.query({
    query: gql`
      query {
        getThingsToDo {
          totalCount
          data {
            gmap {
              bannerImage
            }
            bannerImages
            title
            location {
              country {
                country_name
                _id
              }
              state {
                _id
                state_name
              }
              district {
                _id
                district_name
              }
            }
          }
        }
      }
    `,
  });
  return data?.getThingsToDo?.data;
}
