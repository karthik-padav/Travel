import clientPromise from "lib/mongodb";

const collection_name = "things_to_do";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("travel");
  const things_to_do = await db.collection(collection_name).find({}).toArray();
  let obj = {};
  for (const a of things_to_do) {
    const title = a.title.trim();
    if (obj[title]) obj[title].push(a.uid);
    else obj[title] = [a.uid];
    //   await db
    //     .collection(collection_name)
    //     .updateOne({ uid: a?.uid }, { $setOnInsert: { ...a } }, { upsert: true });
    //   break;
  }

  let _obj = {};
  for (const o in obj) {
    if (obj[o].length > 1) _obj[o] = obj[o];
  }

  res.json({ status: 200, data: _obj });
}
