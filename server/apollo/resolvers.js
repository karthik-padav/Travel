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
      const {
        sort = "createdAt",
        limit,
        skip = 0,
        where = { gpt: { $exists: true } },
      } = args;
      let toDoArray = [
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
        { $match: where },
      ];
      if (limit > 1) toDoArray.push({ $limit: limit });
      const [listResult, countResult] = await Promise.all([
        ToDo.aggregate(toDoArray),
        ToDo.count(where),
      ]);
      return {
        data: listResult,
        totalCount: countResult,
      };
    },
    getNearbyLocation: async (_, args) => {
      const { sort = "createdAt", limit = 20, skip = 0, where = {} } = args;
      const [listResult, countResult] = await Promise.all([
        // ToDo.find({
        //   gmap: {
        //     geoJson: {
        //       $nearSphere: {
        //         $geometry: {
        //           type: "Point",
        //           coordinates: [73.9215933, 15.0887849],
        //         },
        //         $maxDistance: 100,
        //       },
        //     },
        //   },
        // }),
        ToDo.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [73.9215933, 15.0887849],
              },
              distanceField: "distanceFrom",
              maxDistance: 100,
              spherical: true,
            },
          },
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
      console.log(listResult, "listResult123");
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
    // getDistinct: async (_, args) => {
    //   const { dist = "gmap.category", limit = 20, skip = 0, where = {} } = args;
    //   return await ToDo.distinct(dist, where);
    // },
    getWeather: async (_, args) => {
      const { where = {} } = args;
      const {
        latitude = "73.9116272",
        longitude = "15.5008938",
        ...rest
      } = { ...where };
      let weather = {};
      if (latitude && longitude) {
        const _weather = await Weather.findOne({
          latitude: latitude,
          longitude: longitude,
          ...rest,
        });
        if (_weather) {
          console.log(_weather, "From db");
          return _weather;
        } else {
          const API_KEY = "5c018098d783810191a3b46158c7382c";
          let resp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
          );
          if (resp.status === 200) {
            weather = { ...(await resp.json()), latitude, longitude };
            console.log(weather, "weather123");
            const weatherResp = new Weather({ title: weather });
            const savedPost = await weatherResp.save();
            // const savedPost = await Weather.create(weather);
            return weather;
          }
        }
      }
      return weather;
    },
  },

  JSON: GraphQLJSON,
  Date: dateScalar,
};

export default resolvers;
