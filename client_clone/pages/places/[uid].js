import { gql } from "@apollo/client";
import client from "../../apollo/apollo-client";
import PlacesLayout from "@/components/Places";
import { getRoundedList, getThingsToDo } from "@/components/Places/PlaceUits";
import { getLocationList, getMonth } from "@/utils/common";

export default function Places(props) {
  return <PlacesLayout {...props} />;
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
  let promiseResp = [],
    locationList = [],
    promises = [];
  if (uid) {
    promises.push(
      new Promise(async (res) => {
        res({
          list: await getThingsToDo({
            where: {
              $or: [
                { "location.uid": uid },
                { "location.state.uid": uid },
                { "location.state.country.uid": uid },
              ],
            },
          }),
        });
      })
    );
    promises.push(
      new Promise(async (res) => {
        res({
          thingsToDoThisMonth: await getThingsToDo({
            limit: 10,
            where: {
              "gpt.best_months_to_visit": { $in: [getMonth()] },
            },
          }),
        });
      })
    );
    promiseResp = await Promise.allSettled(promises);
    promiseResp = promiseResp
      .filter((i) => i.status === "fulfilled")
      .map((i) => i.value);

    const list = promiseResp.find((i) => i.list)?.list || [];
    let found = list.find(
      (i) =>
        i?.location?.uid === uid ||
        i?.location?.state?.uid === uid ||
        i?.location?.state?.country?.uid === uid
    );
    let key = null;
    if (found?.location?.uid === uid) key = "district";
    else if (found?.location?.state?.uid === uid) key = "state";
    else if (found?.location?.state?.country?.uid === uid) key = "country";

    locationList = await getLocationList({ key, uid });
  }
  return {
    props: {
      uid,
      locationList,
      ...promiseResp.find((i) => i.list),
      ...promiseResp.find((i) => i.thingsToDoThisMonth),
      categories: [
        ...new Set(
          (promiseResp.find((i) => i.list)?.list || [])
            .map((i) => i.gmap.category)
            .filter((i) => i)
        ),
      ],
    },
  };
}
