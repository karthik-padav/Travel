import { gql } from "@apollo/client";
import client from "./apollo-client";

export async function getThingsToDo(params) {
  console.log(params, "params123");
  const { limit = 20, skip = 0, where = {} } = { ...params };

  const { data } = await client.query({
    query: gql`
      query lists($limit: Int, $skip: Int, $where: JSON) {
        getThingsToDo(limit: $limit, skip: $skip, where: $where) {
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

    variables: { where, limit, skip },
  });
  return data?.getThingsToDo?.data;
}
