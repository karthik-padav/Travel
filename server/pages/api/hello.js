import clientPromise from "lib/mongodb";

import path from "path";
import { promises as fs } from "fs";
import data from "json/Goa";
import Things_to_do from "json/Things_to_do";
import Things_to_do_details_link_click from "json/Things_to_do_details_link_click";
import web_URL from "json/web_URL";
// import north_goa_details from "json/north_goa_details";

// const getCountry = async ({ db, country, country_code }) => {
//   let _country = await db.collection("country").find({ country_name: country }).toArray();
//   if (_country.length) {
//     const { _id, ...rest } = _country[0]
//     return { country_id: _id, ...rest }
//   } else {
//     const resp = await db.collection("country").insertOne({ country_name: country, country_code }, { returnOriginal: false });
//     return { country_name: country, country_code, country_id: resp.insertedId }
//   }
// }

// const getState = async ({ db, _country, state }) => {
//   let _state = await db.collection("state").find({ state_name: state, 'country_name': _country.country_name }).toArray();
//   if (_state.length) {
//     const { _id, ...rest } = _state[0]
//     return { state_id: _id, ...rest }
//   } else {
//     const resp = await db.collection("state").insertOne({ state_name: state, ..._country }, { returnOriginal: false });
//     return { state_id: resp.insertedId, state_name: state, ..._country }
//   }
// }

// const getDistrict = async ({ db, _state, district }) => {
//   let _district = await db.collection("district").find({ district_name: district, 'state_name': _state.state_name }).toArray();
//   if (_district.length) {
//     const { _id, ...rest } = _district[0]
//     return { district_id: _id, ...rest }
//   } else {
//     const resp = await db.collection("district").insertOne({ district_name: district, ..._state }, { returnOriginal: false });
//     return { district_id: resp.insertedId, district_name: district, ..._state }
//   }
// }

// const getLocation = async ({ db, location }) => {
//   let finalLocation
//   const { address } = { ...location }
//   const { country, country_code, state, state_district, village, town, county, city, neighbourhood } = { ...address }
//   if (country) {
//     const _country = await getCountry({ db, country, country_code })
//     if (state) {
//       const _state = await getState({ db, _country, state })
//       const district = state_district || county || city || village || town || neighbourhood
//       if (district) {
//         finalLocation = await getDistrict({ db, _state, district })
//       }
//     }
//   }
//   return finalLocation
// }

function getWeb_URL(o) {
  let obj = { ...o };
  for (const o in obj) {
    if (obj[o].web_URL) {
      const found = web_URL.find((i) => web_URL === obj[o].Original_gmap_URL);
      if (found) obj[o].gmap_url = found.gmap_url;
    }
  }
  return obj;
}

export default async function handler(req, res) {
  // const jsonDirectory = path.join(process.cwd(), 'json');
  // //Read the json data file data.json
  // let fileContents = await fs.readFile(jsonDirectory + '/Goa.json', 'utf8');
  // //Return the content of the data file in json format
  // fileContents = JSON.parse(fileContents)
  let arr = [];
  let data = {
    district_name: "",
    page_thumbnail: "",
  };
  let obj = {};
  for (const d of Things_to_do) {
    if (d.page_thumbnail) {
      data.page_thumbnail = d.page_thumbnail;
    }

    obj[d.title] = {
      title: obj[d.title]?.title ? obj[d.title]?.title : d.title,
      image: obj[d.title]?.image ? obj[d.title]?.image : d.image,
      sub_title: obj[d.title]?.sub_title
        ? obj[d.title]?.sub_title
        : d.sub_title,
      ratings: obj[d.title]?.ratings ? obj[d.title]?.ratings : d.ratings,
      review: obj[d.title]?.review ? obj[d.title]?.review : d.review,
      details_url: obj[d.title]?.details_url
        ? obj[d.title]?.details_url
        : `https://www.google.com${d.details_url}`,
    };
  }

  for (const d of Things_to_do_details_link_click) {
    obj[d.title] = {
      ...(obj[d.title] || {}),
      rate: obj[d.title]?.rate ? obj[d.title]?.rate : d.rate,
      description: obj[d.title]?.description
        ? obj[d.title]?.description
        : d.description,
      web_URL: obj[d.title]?.web_URL ? obj[d.title]?.web_URL : d.web_URL,
      timings: obj[d.title]?.timings ? obj[d.title]?.timings : d.timings,
      images: obj[d.title]?.images
        ? [...obj[d.title]?.images, d.image_URL]
        : [d.image_URL],
    };
  }

  obj = getWeb_URL(obj);

  for (const o in obj) {
    arr.push(obj[o]);
  }
  data.list = arr;

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
  res.status(200).json(data);

  // const client = await clientPromise;
  // const db = client.db("travel");
  // // //Find the absolute path of the json directory
  // // const jsonDirectory = path.join(process.cwd(), 'json');
  // // //Read the json data file data.json
  // // let fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  // // //Return the content of the data file in json format
  // // fileContents = JSON.parse(fileContents)

  // let array = [];
  // // let allPosts = await db.collection("things_to_do").find({ "location.country_code": { "$exists": true } }).toArray();
  // let allPosts = await db.collection("things_to_do").find({}).toArray();
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

  //   {
  //     "_id" : ObjectId("63d90475a01eda5832e61aac"),
  //     "district_name" : "Garelth",
  //     "state_id" : ObjectId("63d90475a01eda5832e61aab"),
  //     "state_name" : "Gilgit-Baltistan",
  //     "country_name" : "Pakistan",
  //     "country_code" : "pk",
  //     "country_id" : ObjectId("63d90475a01eda5832e61aaa")
  // }

  // res.status(200).json(json);
}
