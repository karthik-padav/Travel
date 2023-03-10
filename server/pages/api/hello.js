import clientPromise from "lib/mongodb";



import path from 'path';
import { promises as fs } from 'fs';


const getCountry = async ({ db, country, country_code }) => {
  let _country = await db.collection("country").find({ country_name: country }).toArray();
  if (_country.length) {
    const { _id, ...rest } = _country[0]
    return { country_id: _id, ...rest }
  } else {
    const resp = await db.collection("country").insertOne({ country_name: country, country_code }, { returnOriginal: false });
    return { country_name: country, country_code, country_id: resp.insertedId }
  }
}

const getState = async ({ db, _country, state }) => {
  let _state = await db.collection("state").find({ state_name: state, 'country_name': _country.country_name }).toArray();
  if (_state.length) {
    const { _id, ...rest } = _state[0]
    return { state_id: _id, ...rest }
  } else {
    const resp = await db.collection("state").insertOne({ state_name: state, ..._country }, { returnOriginal: false });
    return { state_id: resp.insertedId, state_name: state, ..._country }
  }
}

const getDistrict = async ({ db, _state, district }) => {
  let _district = await db.collection("district").find({ district_name: district, 'state_name': _state.state_name }).toArray();
  if (_district.length) {
    const { _id, ...rest } = _district[0]
    return { district_id: _id, ...rest }
  } else {
    const resp = await db.collection("district").insertOne({ district_name: district, ..._state }, { returnOriginal: false });
    return { district_id: resp.insertedId, district_name: district, ..._state }
  }
}

const getLocation = async ({ db, location }) => {
  let finalLocation
  const { address } = { ...location }
  const { country, country_code, state, state_district, village, town, county, city, neighbourhood } = { ...address }
  if (country) {
    const _country = await getCountry({ db, country, country_code })
    if (state) {
      const _state = await getState({ db, _country, state })
      const district = state_district || county || city || village || town || neighbourhood
      if (district) {
        finalLocation = await getDistrict({ db, _state, district })
      }
    }
  }
  return finalLocation
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("travel");
  // //Find the absolute path of the json directory
  // const jsonDirectory = path.join(process.cwd(), 'json');
  // //Read the json data file data.json
  // let fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  // //Return the content of the data file in json format
  // fileContents = JSON.parse(fileContents)


  let array = []
  // let allPosts = await db.collection("things_to_do").find({ "location.country_code": { "$exists": true } }).toArray();
  let allPosts = await db.collection("state").find({  }).toArray();
  for (let a of allPosts) {
    // let p = a.gmap.pageURL.split('/').filter(i => i.includes('@'))?.[0]?.replace('@', '')?.split(',')
    // const latitude = p?.[0]
    // const longitude = p?.[1]
    // if (latitude && longitude) {

    //   //json, geojson, geocodejson, jsonv2, 
    //   let location = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&accept-language=en`)
    //   location = await location.json()
    //   console.log(location, 'location', latitude, longitude, a._id)
    //   const location_code = await getLocation({ db, location })
    //   if(location_code){
    //     array.push({ ...location, ...location_code })
    //     a.location = { ...location, ...location_code }
    //   }
    // }
    // await db.collection("things_to_do").updateOne({ "_id": a._id }, { $set: a });

    
    }


    //   {
    //     "_id" : ObjectId("63d90475a01eda5832e61aac"),
    //     "district_name" : "Garelth",
    //     "state_id" : ObjectId("63d90475a01eda5832e61aab"),
    //     "state_name" : "Gilgit-Baltistan",
    //     "country_name" : "Pakistan",
    //     "country_code" : "pk",
    //     "country_id" : ObjectId("63d90475a01eda5832e61aaa")
    // }

  }
  res.status(200).json('array');
}



