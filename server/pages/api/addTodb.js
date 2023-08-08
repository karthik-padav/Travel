import clientPromise from "lib/mongodb";
import things_to_do from "../../json/backup/things_to_do.json";
import country from "../../json/backup/country.json";
import state from "../../json/backup/state.json";
import district from "../../json/backup/district.json";

const collection_name = "things_to_do";
const c_country = "country";
const c_state = "state";
const c_district = "district";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("travel");

  for (const a of things_to_do) {
    await db
      .collection(collection_name)
      .updateOne({ uid: a?.uid }, { $setOnInsert: { ...a } }, { upsert: true });
  }

  for (const a of country) {
    await db
      .collection(c_country)
      .updateOne({ uid: a?.uid }, { $setOnInsert: { ...a } }, { upsert: true });
  }

  for (const a of state) {
    await db
      .collection(c_state)
      .updateOne({ uid: a?.uid }, { $setOnInsert: { ...a } }, { upsert: true });
  }

  for (const a of district) {
    await db
      .collection(c_district)
      .updateOne({ uid: a?.uid }, { $setOnInsert: { ...a } }, { upsert: true });
  }

  res.json({ status: 200, data: "allPosts" });
}
