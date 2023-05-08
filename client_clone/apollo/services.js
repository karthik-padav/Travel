import { gql } from "@apollo/client";
import client from "./apollo-client";

export async function getThingsToDo(params) {
  const { limit = 20, skip = 0, where = {} } = { ...params };

  const { data } = await client.query({
    query: gql`
      query lists($limit: Int, $skip: Int, $where: JSON) {
        getThingsToDo(limit: $limit, skip: $skip, where: $where) {
          totalCount
          data {
            title
            uid
            image
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

    variables: { where, limit, skip },
  });
  return data?.getThingsToDo?.data;
}

