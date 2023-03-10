import Post from "apollo/models/Post.model";
import ToDo from "apollo/models/ToDo.model";
import District from "apollo/models/District.model";
import State from "apollo/models/State.model";
import Country from "apollo/models/Country.model";
import GraphQLJSON from "graphql-type-json";
import { ApolloError } from "apollo-server-micro";
import { GraphQLScalarType, Kind } from "graphql";
const mongoose = require("mongoose");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
});

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world";
    },
    getThingsToDo: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        // ToDo.find(where)
        //   .skip(skip)
        //   .limit(limit)
        //   .sort({ [sort]: -1 }),
        ToDo.aggregate([
          {
            $lookup: {
              from: "country",
              localField: "location.country_id",
              foreignField: "_id",
              as: "location.country"
            }
          },
          {
            $lookup: {
              from: "state",
              localField: "location.state_id",
              foreignField: "_id",
              as: "location.state"
            }
          },
          {
            $lookup: {
              from: "district",
              localField: "location.district_id",
              foreignField: "_id",
              as: "location.district"
            }
          },
          { $unwind: '$location.country' },
          { $unwind: '$location.state' },
          { $unwind: '$location.district' },
          //  {
          //   $unwind: {
          //     path: "$state",
          //     preserveNullAndEmptyArrays: true
          //   }
          // }, {
          //   $lookup: {
          //     from: "country",
          //     localField: "address._id",
          //     foreignField: "address_id",
          //     as: "address.addressComment",
          //   }
          // },
          { $limit: 2 }
        ]),
        ToDo.count(where),
      ]);
      return {
        data: listResult,
        totalCount: countResult,
      };
    },
    getDistricts: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        District.aggregate([
          { $match: where, },
          { $lookup: { from: "state", localField: "state_id", foreignField: "_id", as: "state" } },
          { $unwind: '$state' },
          { $lookup: { from: "country", localField: "state.country_id", foreignField: "_id", as: "country" } },
          { $unwind: '$country' },
          { $limit: limit }
        ]),
        District.count(where),
      ]);
      return {
        data: listResult,
        totalCount: countResult,
      };
    },
    getCountries: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        Country.find(where)
          .skip(skip)
          .limit(limit)
          .sort({ [sort]: -1 }),
        Country.count(where),
      ]);
      console.log(listResult,'listResult123')
      return {
        data: listResult,
        totalCount: countResult,
      };
    },
    getStates: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        State.aggregate([
          { $match: where, },
          { $lookup: { from: "country", localField: "country_id", foreignField: "_id", as: "country" } },
          { $unwind: '$country' },
          { $limit: limit }
        ]),
        State.count(where),
      ]);
      return {
        data: listResult,
        totalCount: countResult,
      };
    },
    getDistricts: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        District.aggregate([
          { $match: where, },
          { $lookup: { from: "state", localField: "state_id", foreignField: "_id", as: "state" } },
          { $unwind: '$state' },
          { $lookup: { from: "country", localField: "state.country_id", foreignField: "_id", as: "country" } },
          { $unwind: '$country' },
          { $limit: limit }
        ]),
        District.count(where),
      ]);
      return {
        data: listResult,
        totalCount: countResult,
      };
    },

    getPosts: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        Post.find(where)
          .skip(skip)
          .limit(limit)
          .sort({ [sort]: -1 }),
        Post.count(where),
      ]);

      return {
        data: listResult,
        totalCount: countResult,
      };
    },
  },

  Post: {
    products: async (parent, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        ToDo.find({
          _id: { $in: parent.products },
          ...where,
        })
          .skip(skip)
          .limit(limit)
          .sort({ [sort]: -1 }),
        ToDo.count({
          _id: { $in: parent.products },
          ...where,
        }),
      ]);

      return {
        data: listResult,
        totalCount: countResult,
      };
    },
  },

  JSON: GraphQLJSON,
  Date: dateScalar,

  Mutation: {
    createPost: async (parent, args, context, info) => {
      const slugList = await Post.find({ slug: args.post.slug });
      if (slugList.length) return new ApolloError("Slug exists");
      const postCreated = await Post.insertMany(args.post);
      return postCreated[0];
    },

    deletePost: async (parent, args, context, info) => {
      const { id } = args;
      const resp = await Post.findByIdAndDelete(id);
      return resp?.id || false;
    },

    updatePost: async (parent, args, context, info) => {
      const { id } = args;
      const posts = await Post.find({ slug: args.post.slug });
      for (const post of posts) {
        if (post.id !== id) {
          throw new Error("Slug exists");
        }
      }
      return await Post.findByIdAndUpdate(id, args.post, { new: true });
    },
  },
};

export default resolvers;
