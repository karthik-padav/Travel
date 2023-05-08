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
