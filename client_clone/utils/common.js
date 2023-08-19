import { Phone, Website, Address } from "@/utils/icons";
import { gql } from "@apollo/client";
import client from "@/apollo/apollo-client";

export const getHowToReach = ({
  railway_station_distance,
  title = "",
  nearest_railway_station,
  nearest_airport,
  how_to_reach_by_bus,
  airport_distance,
}) => {
  let byAir,
    byTrain,
    byRoad = how_to_reach_by_bus;
  if (nearest_railway_station)
    byTrain = `Nearest railway station is ${nearest_railway_station}`;
  if (railway_station_distance)
    byTrain += `, which is ${
      railway_station_distance.toLowerCase().includes("km")
        ? railway_station_distance
        : railway_station_distance + " km"
    } away from ${title}, One can take taxi to reach the destination`;

  if (nearest_airport) byAir = `Nearest airport is ${nearest_airport}`;
  if (airport_distance)
    byAir += `, which is ${
      airport_distance.toLowerCase().includes("km")
        ? airport_distance
        : airport_distance + " km"
    } away from ${title}, One can take taxi to reach the destination`;

  return { byAir, byRoad, byTrain };
};

export const getWeather = async (latitude, longitude) => {
  let resp = await fetch(
    `${process.env.BASE_URL}/api/getWeather?latitude=${latitude}&longitude=${longitude}`
  );
  resp = await resp.json();
  if (resp.status === 200) {
    let weatherData = [
      { title: "Temperature", value: `${resp.data.main.temp}°C` },
      { title: "Humidity", value: `${resp.data.main.humidity}%` },
      { title: "Wind Speed", value: `${resp.data.wind.speed}m/s` },
    ];
    for (const w of resp.data?.weather || []) {
      weatherData.push({ title: w.description, icon: w.icon });
    }
    return weatherData;
  }
};

export const getInfo = ({ address, phone, gmapURL, website }) => {
  let info = [];
  if (address)
    info.push({
      value: (
        <a target="_blank" href={gmapURL}>
          {address}
        </a>
      ),
      icon: <Address />,
    });
  if (phone)
    info.push({
      label: "",
      value: <a href={`tel:${phone}`}>{phone}</a>,
      icon: <Phone />,
    });
  if (website)
    info.push({
      label: "",
      value: (
        <a target="_blank" href={website}>
          {website}
        </a>
      ),
      icon: <Website />,
    });
  return info;
};

export const meterToKm = (meter) => {
  return (meter * 0.001).toFixed(1);
};

export const generateURL = ({ uid, title = "", key }) => {
  const obj = {
    about: "/about",
    privacyPolicy: "/privacy-policy",
    terms: "/terms",
    contact: "/contact",
    details: `/details/${uid}+${title}`,
    places: `/places/${uid}${title ? `+place+to+visit+in+${title}` : ""}`,
  };
  return obj?.[key]?.replace(/ /g, "+") || "/";
};

export const getLocationList = async ({ key, uid, params }) => {
  let { where = {}, limit = 15, skip = 0 } = { ...params };
  switch (key) {
    case "country":
      where = { ...where, country_id: uid };
      let states = await client.query({
        query: gql`
          query lists($limit: Int, $skip: Int, $where: JSON) {
            getStates(limit: $limit, skip: $skip, where: $where) {
              data {
                state_name
                banner_image
                uid
              }
            }
          }
        `,
        variables: { where, limit, skip },
      });
      return states?.data?.getStates?.data || [];
    case "state":
      where = { ...where, state_id: uid };
      let district = await client.query({
        query: gql`
          query lists($limit: Int, $skip: Int, $where: JSON) {
            getDistricts(limit: $limit, skip: $skip, where: $where) {
              data {
                district_name
                banner_image
                uid
              }
            }
          }
        `,
        variables: { where, limit, skip },
      });
      return district?.data?.getDistricts?.data || [];

    default:
      return [];
  }
};

export const getMonth = () => {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[new Date().getMonth() - 1];
};
