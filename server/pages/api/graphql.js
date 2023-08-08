import { ApolloServer, makeExecutableSchema } from "apollo-server-micro";
import dbConnect from "lib/dbConnect";
import typeDefs from "apollo/typeDefs";
import resolvers from "apollo/resolvers";
import Cors from "micro-cors";

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const cors = Cors({
  allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = new ApolloServer({
  schema,
  fetchOptions: { mode: "no-cors" },
  context: async () => {
    await dbConnect();
  },
  playground: true,
  introspection: true,
});

const startServer = server.start();

export default cors(async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if ((process?.env?.WHITE_LIST || "").split(",").includes(req.headers.origin))
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await server.createHandler({
    path: "/api/graphql",
  })(req, res);
});
