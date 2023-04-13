import clientPromise from "lib/mongodb";
import { v4 as uuidv4 } from "uuid";

import path from "path";
import { promises as fs } from "fs";
import data from "json/Goa";
// import Things_to_do from "json/Things_to_do";
// import Things_to_do_details_link_click from "json/Things_to_do_details_link_click";
import grab_gmap_url from "json/grab_gmap_url";
import gmap_details from "json/gmap_details";
import north_goa from "json/north_goa";

const collection_name = "_things_to_do";
const c_country = "_country";
const c_state = "_state";
const c_district = "_district";

async function update_gmap_url(allPosts, db) {
  for (const a of allPosts) {
    if (a.web_URL) {
      const found = grab_gmap_url.find(
        (i) => i.original_gmap_URL === a.web_URL
      );
      if (found?.gmap_url) {
        await db.collection(collection_name).updateOne(
          { _id: a?._id },
          {
            $set: {
              ...a,
              gmap_url: `https://www.google.com${found.gmap_url}`,
            },
          }
        );
      }
    }
  }
}

async function update_gmap_details(allPosts, db) {
  for (const a of allPosts) {
    let obj = { ...a };
    const found = gmap_details.find((i) => i.original_URL === a.gmap_url);
    if (found) {
      let { original_URL, ...gmap } = found;
      let p = found.page_URL
        .split("/")
        .filter((i) => i.includes("@"))?.[0]
        ?.replace("@", "")
        ?.split(",");
      const latitude = p?.[0];
      const longitude = p?.[1];
      if (latitude && longitude) {
        gmap.geoJson = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
      }
      gmap.review_count = Number(found.review_count.replace(/\(|\)|,/g, ""));
      if (gmap.timings) gmap.timings = gmap.timings;
      else delete gmap.timings;

      if (gmap.sub_title) gmap.sub_title = gmap.sub_title;
      else delete gmap.sub_title;

      if (gmap.website) gmap.website = gmap.website.trim();
      else delete gmap.website;

      if (gmap.rating) gmap.rating = Number(gmap.rating.trim());
      else delete gmap.rating;

      if (gmap.address) gmap.address = gmap.address.trim();
      else delete gmap.address;

      if (gmap.phone) gmap.phone = gmap.phone.trim();
      else delete gmap.phone;

      if (gmap.description) gmap.description = gmap.description.trim();
      else delete gmap.description;

      if (gmap.category) gmap.category = gmap.category.trim();
      else delete gmap.category;

      if (gmap.plus_code) gmap.plus_code = gmap.plus_code.trim();
      else delete gmap.plus_code;

      if (gmap.timings)
        gmap.timings = gmap.timings
          .replace(/Hide open hours for the week|Hours might differ/g, "")
          .split(";")
          .map((i) => i.trim());
      else delete gmap.timings;

      obj.gmap = gmap;
      console.log(obj.gmap, "gmap");
      await db
        .collection(collection_name)
        .updateOne({ _id: a?._id }, { $set: obj });
    }
  }
}

const getCountry = async ({ db, country, country_code }) => {
  let _country = await db
    .collection(c_country)
    .find({ country_name: country })
    .toArray();
  if (_country.length) {
    return _country[0]?.uid;
  } else {
    let resp = await db
      .collection(c_country)
      .insertOne(
        { country_name: country, country_code, uid: uuidv4() },
        { returnOriginal: false }
      );
    resp = await db
      .collection(c_country)
      .find({ _id: resp.insertedId })
      .toArray();
    return resp[0]?.uid;
  }
};

const getState = async ({ db, _country, state }) => {
  let _state = await db
    .collection(c_state)
    .find({ state_name: state, country_id: _country })
    .toArray();
  if (_state.length) {
    return _state[0]?.uid;
  } else {
    let resp = await db
      .collection(c_state)
      .insertOne(
        { state_name: state, country_id: _country, uid: uuidv4() },
        { returnOriginal: false }
      );
    resp = await db
      .collection(c_state)
      .find({ _id: resp.insertedId })
      .toArray();
    return resp[0]?.uid;
  }
};

const getDistrict = async ({ db, _state, district }) => {
  let _district = await db
    .collection(c_district)
    .find({ district_name: district, state_id: _state })
    .toArray();
  if (_district.length) {
    return _district[0]?.uid;
  } else {
    let resp = await db
      .collection(c_district)
      .insertOne(
        { district_name: district, state_id: _state, uid: uuidv4() },
        { returnOriginal: false }
      );
    resp = await db
      .collection(c_district)
      .find({ _id: resp.insertedId })
      .toArray();
    return resp[0].uid;
  }
};

const getLocation = async ({ db, location }) => {
  let finalLocation;
  const { address } = { ...location };
  const {
    country,
    country_code,
    state,
    state_district,
    village,
    town,
    county,
    city,
    neighbourhood,
  } = { ...address };
  if (country) {
    const _country = await getCountry({ db, country, country_code });
    console.log(_country, "_country");
    if (state) {
      const _state = await getState({ db, _country, state });
      console.log(_state, "_state");
      const district =
        state_district || county || city || village || town || neighbourhood;
      if (district) {
        finalLocation = await getDistrict({ db, _state, district });
        console.log(finalLocation, "district");
      }
    }
  }
  return finalLocation;
};

export default async function handler(req, res) {
  // const jsonDirectory = path.join(process.cwd(), 'json');
  // //Read the json data file data.json
  // let fileContents = await fs.readFile(jsonDirectory + '/Goa.json', 'utf8');
  // //Return the content of the data file in json format
  // fileContents = JSON.parse(fileContents)
  //   let arr = [];
  //   let data = {
  //     district_name: "",
  //     page_thumbnail: "",
  //   };
  //   let obj = {};
  //   for (const d of Things_to_do) {
  //     if (d.page_thumbnail) {
  //       data.page_thumbnail = d.page_thumbnail;
  //     }

  //     obj[d.title] = {
  //       title: obj[d.title]?.title ? obj[d.title]?.title : d.title,
  //       image: obj[d.title]?.image ? obj[d.title]?.image : d.image,
  //       sub_title: obj[d.title]?.sub_title
  //         ? obj[d.title]?.sub_title
  //         : d.sub_title,
  //       ratings: obj[d.title]?.ratings ? obj[d.title]?.ratings : d.ratings,
  //       review: obj[d.title]?.review ? obj[d.title]?.review : d.review,
  //       details_url: obj[d.title]?.details_url
  //         ? obj[d.title]?.details_url
  //         : `https://www.google.com${d.details_url}`,
  //     };
  //   }

  //   for (const d of Things_to_do_details_link_click) {
  //     obj[d.title] = {
  //       ...(obj[d.title] || {}),
  //       rate: obj[d.title]?.rate ? obj[d.title]?.rate : d.rate,
  //       description: obj[d.title]?.description
  //         ? obj[d.title]?.description
  //         : d.description,
  //       web_URL: obj[d.title]?.web_URL ? obj[d.title]?.web_URL : d.web_URL,
  //       timings: obj[d.title]?.timings ? obj[d.title]?.timings : d.timings,
  //       images: obj[d.title]?.images
  //         ? [...obj[d.title]?.images, d.image_URL]
  //         : [d.image_URL],
  //     };
  //   }

  //   obj = getWeb_URL(obj);

  //   for (const o in obj) {
  //     arr.push(obj[o]);
  //   }
  //   data.list = arr;

  // for (const d of north_goa) {
  //   let _temp = { ...d };
  //   const found = north_goa_details.find((i) => i.Original_URL === d.details_url);
  //   // console.log(found)
  //   _temp.images = found.images.split(' ').filter(i=>i.includes('src')).map(i=> i.replace('src=\"','')).map(i=>i.replace('"></easy-img></div><div"',''))
  //   // _temp.rate = found.rate;
  //   // _temp.description = found.description;
  //   // _temp.web_URL = found.web_URL;
  //   arr.push(_temp);
  // }
  //   res.status(200).json(data);

  const client = await clientPromise;
  const db = client.db("travel");

  

  let allPosts = await db.collection(c_district).find({}).toArray();

  //   await update_gmap_url(allPosts,db)

  // await update_gmap_details(allPosts, db);
//   let arr = [];
//   for (var a of allPosts) {
//     const longitude = a.gmap.geoJson.coordinates[0];
//     const latitude = a.gmap.geoJson.coordinates[1];
//     console.log(latitude, longitude);
//     let location = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&accept-language=en`
//     );
//     location = await location.json();
//     const location_code = await getLocation({ db, location });
//     if (location_code) {
//       await db
//         .collection(collection_name)
//         .updateOne(
//           { _id: a._id },
//           {
//             $set: {
//               location: location_code,
//               open_street_map_location: location,
//             },
//           }
//         );
//     }
//     arr.push(location);
//     // break;
//   }

  res.status(200).json(allPosts);

  // let array = [];
  // // let allPosts = await db.collection(collection_name).find({ "location.country_code": { "$exists": true } }).toArray();
  // let allPosts = await db.collection(collection_name).find({}).toArray();
  // for (let a of allPosts) {
  //   if (a.gmap.longitude && a.gmap.latitude) {
  //     a.gmap.geoJson = {
  //       type: "Point",
  //       coordinates: [a.gmap.longitude, a.gmap.latitude],
  //     };
  //     console.log(a);
  //   }
  //   // let p = a.gmap.pageURL.split('/').filter(i => i.includes('@'))?.[0]?.replace('@', '')?.split(',')
  //   // const latitude = p?.[0]
  //   // const longitude = p?.[1]
  //   // if (latitude && longitude) {

  //   //   //json, geojson, geocodejson, jsonv2,
  //   //   let location = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&accept-language=en`)
  //   //   location = await location.json()
  //   //   console.log(location, 'location', latitude, longitude, a._id)
  //   //   const location_code = await getLocation({ db, location })
  //   //   if(location_code){
  //   //     array.push({ ...location, ...location_code })
  //   //     a.location = { ...location, ...location_code }
  //   //   }
  //   // }
  //   await db.collection("things_to_do").updateOne({ "_id": a._id }, { $set: a });
  //   break;
  // }
}
