import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-micro";

const typeDefs = gql`
  scalar JSON
  scalar Date

  type Gmap {
    title: String
    sub_title: String
    description: String
    rating: String
    review_count: String
    timings: JSON
    website: String
    address: String
    phone: String
    plus_code: String
    geoJson: JSON
    page_URL: String
    category: String
    bannerImage: String
  }
  type Location {
    district_id: ID
    state_id: ID
    country_id: ID
    country: Country
    state: State
    district: District
  }

  type Country {
    country_name: String
    uid: ID
  }
  type State {
    state_name: String
    country_id: ID
    uid: ID
  }
  type District {
    district_name: String
    state_id: ID
    _id: ID
  }

  type _State {
    state_name: String
    uid: ID
    country: _Country
    banner_image: String
  }

  type _Country {
    country_name: String
    uid: ID
    banner_image: String
  }

  type _Location {
    district_name: String
    uid: String
    state: _State
    banner_image: String
  }

  type GPT {
    nearest_railway_station: String
    railway_station_distance: String
    nearest_airport: String
    airport_distance: String
    how_to_reach_by_bus: String
    things_to_do: JSON
    famous_food_to_try: JSON
    best_months_to_visit: JSON
    famous_for: JSON
    entry_fee: String
    exploration_hours: String
  }

  type ToDo {
    id: ID
    gpt:GPT
    title: String
    image: String
    images: JSON
    sub_title: String
    ratings: String
    review: String
    rate: String
    description: String
    gmap_url: String
    uid: String
    gmap: Gmap
    open_street_map_location: JSON
    location: _Location
  }

  type ToDoPagination {
    data: [ToDo]
    totalCount: String
  }

  type DistrictList {
    uid: ID
    country: Country
    state: State
    district_name: String
    banner_image: String
  }

  type DistrictListPagination {
    data: [DistrictList]
    totalCount: String
  }

  type StateList {
    uid: ID
    country: Country
    state_name: String
    banner_image: String
  }

  type StateListPagination {
    data: [StateList]
    totalCount: String
  }

  type CountryList {
    uid: ID
    country_name: String
    country_code: String
    banner_image: String
  }

  type CountryListPagination {
    data: [CountryList]
    totalCount: String
  }

  type Query {
    hello: String
    getThingsToDo(
      sort: String
      limit: Int
      skip: Int
      where: JSON
    ): ToDoPagination
    getNearbyLocation(
      sort: String
      limit: Int
      skip: Int
      where: JSON
    ): ToDoPagination
    getDistricts(
      sort: String
      limit: Int
      skip: Int
      where: JSON
    ): DistrictListPagination
    getStates(
      sort: String
      limit: Int
      skip: Int
      where: JSON
    ): StateListPagination
    getCountries(
      sort: String
      limit: Int
      skip: Int
      where: JSON
    ): CountryListPagination
    getDistinct(sort: String, limit: Int, skip: Int, where: JSON): JSON
  }
`;

export default typeDefs;
