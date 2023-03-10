import clientPromise from "lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("travel");
  console.log(req.method,'method')
  switch (req.method) {
    case "POST":
      // let bodyObject = JSON.parse(req.body);
      // let myPost = await db.collection("posts").insertOne(bodyObject);
      // res.json(myPost.ops[0]);
      // break;
    case "GET":
    //   let allPosts = await db.collection("country").find({}).toArray();
      // allPosts = await db.collection("country").insertOne({name:"asdasd"});
      res.json({ status: 200, data:  'allPosts' });
      break;
  }
}