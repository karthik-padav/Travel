import { gql } from "@apollo/client";
import client from "../../apollo/apollo-client";

export const getRoundedList = async () => {
  let roundedList = await client.query({
    query: gql`
      query lists($limit: Int, $skip: Int, $where: JSON) {
        getStates(limit: $limit, skip: $skip, where: $where) {
          data {
            state_name
            banner_image
            uid
          }
        }
      }
    `,
    variables: { where: {}, limit: 15, skip: 0 },
  });
  roundedList = roundedList?.data?.getStates?.data || [];
};

export async function getThingsToDo(params) {
  const { where = {} } = { ...params };

  const { data } = await client.query({
    query: gql`
      query lists($limit: Int, $skip: Int, $where: JSON) {
        getThingsToDo(limit: $limit, skip: $skip, where: $where) {
          data {
            uid
            image
            title
            ratings
            gmap {
              rating
              category
            }
            location {
              uid
              district_name
              banner_image
              things_to_do
              state {
                uid
                banner_image
                things_to_do
                state_name
                country {
                  uid
                  things_to_do
                  banner_image
                  country_name
                }
              }
            }
          }
        }
      }
    `,
    variables: { where },
  });
  return data?.getThingsToDo?.data || [];
}
