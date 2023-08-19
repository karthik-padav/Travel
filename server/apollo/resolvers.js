import Post from "apollo/models/Post.model";
import ToDo from "apollo/models/ToDo.model";
import District from "apollo/models/District.model";
import State from "apollo/models/State.model";
import Country from "apollo/models/Country.model";
import Weather from "apollo/models/Weather.model";

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
      const { sort = "createdAt", limit, where = {} } = args;
      const { lat, long, maxDistance, ...restWhere } = where;
      let geoRadius = [];
      if (lat && long) {
        geoRadius = [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [Number(long), Number(lat)],
              },
              distanceField: "distance",
              spherical: true,
              maxDistance: maxDistance || 1000,
              sort: "distance",
            },
          },
        ];
      }
      let toDoArray = [
        ...geoRadius,
        {
          $lookup: {
            from: "district",
            localField: "location",
            foreignField: "uid",
            as: "location",
          },
        },
        { $unwind: "$location" },
        {
          $lookup: {
            from: "state",
            localField: "location.state_id",
            foreignField: "uid",
            as: "location.state",
          },
        },
        { $unwind: "$location.state" },
        {
          $lookup: {
            from: "country",
            localField: "location.state.country_id",
            foreignField: "uid",
            as: "location.state.country",
          },
        },
        { $unwind: "$location.state.country" },
        { $match: restWhere },
      ];
      if (limit > 1) toDoArray.push({ $limit: limit });
      toDoArray.push({ $sort: { "gmap.review_count": -1 } });
      await ToDo.init();
      const [listResult, countResult] = await Promise.all([
        ToDo.aggregate(toDoArray),
        ToDo.count(restWhere),
      ]);
      console.log(listResult, "listResult123");
      console.log(restWhere, "restWhere123");
      return { data: listResult, totalCount: countResult };
    },
    getDistricts: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      console.log(JSON.stringify(where), "restWhere");
      const [listResult, countResult] = await Promise.all([
        District.aggregate([
          {
            $lookup: {
              from: "state",
              localField: "state_id",
              foreignField: "uid",
              as: "state",
            },
          },
          { $unwind: "$state" },
          {
            $lookup: {
              from: "country",
              localField: "state.country_id",
              foreignField: "uid",
              as: "country",
            },
          },
          { $unwind: "$country" },
          { $limit: limit },
          { $match: where },
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
      return {
        data: listResult,
        totalCount: countResult,
      };
    },
    getStates: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        State.aggregate([
          { $match: where },
          {
            $lookup: {
              from: "country",
              localField: "country_id",
              foreignField: "uid",
              as: "country",
            },
          },
          { $unwind: "$country" },
          { $limit: limit },
        ]),
        State.count(where),
      ]);
      return { data: listResult, totalCount: countResult };
    },
  },

  JSON: GraphQLJSON,
  Date: dateScalar,
};

export default resolvers;
