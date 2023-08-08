import { Phone, Website, Address } from "@/utils/icons";

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
