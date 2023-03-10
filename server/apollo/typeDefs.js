import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-micro";

const typeDefs = gql`
  scalar JSON
  scalar Date




  
  type Gmap {
    category: String
  }
  type Location {
    district_id: ID
    state_id: ID
    country_id: ID
    country:Country
    state: State
    district:District
  }


  type Country{
    country_name: String
    _id: ID
  }
  type State{
    state_name: String
    country_id:ID
    _id: ID
  }
  type District{
    district_name: String
    state_id:ID
    _id: ID
  }

  type ToDo {
    id: ID
    title: String
    gmap: Gmap
    location: Location
    country:JSON
    state:JSON
  }

  type ToDoPagination {
    data: [ToDo]
    totalCount: String
  }


  type DistrictList {
    _id: ID
    country:Country
    state:State
    district_name:String
  }

  type DistrictListPagination {
    data: [DistrictList]
    totalCount: String
  }

  type StateList {
    _id: ID
    country:Country
    state_name:String
  }

  type StateListPagination {
    data: [StateList]
    totalCount: String
  }

  type CountryList {
    _id: ID
    country_name: String
    country_code: String
  }

  type CountryListPagination {
    data: [CountryList]
    totalCount: String
  }
  











  input PostInput {
    title: String!
    searchKeyword: String!
    slug: String!
    category: String!
  }

  input PostUpdate {
    title: String!
    searchKeyword: String!
    slug: String!
  }

  input ProductInput {
    title: String!
    productId: String!
    productColors: JSON
    price: JSON
    rating: Float
    thumbnail: JSON
    reviews: JSON
  }

  type Post {
    id: ID
    title: String
    searchKeyword: String
    slug: String
    category: String
    lastScrappedOn: Date
    products(
      sort: String
      limit: Int
      skip: Int
      where: JSON
    ): ProductsPagination
  }

  type Products {
    id: ID
    title: String
    productId: String
    productColors: JSON
    price: JSON
    rating: Float
    thumbnail: JSON
    reviews: JSON
    images: JSON
    features: JSON
    technicalDetails: JSON
    productInformation: JSON
  }

  type ProductsPagination {
    data: [Products]
    totalCount: String
  }

  type PostPagination {
    data: [Post]
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
    
    getPosts(sort: String, limit: Int, skip: Int, where: JSON): PostPagination
  }

  type Mutation {
    createPost(post: PostInput): Post
    createProduct(product: [ProductInput]): [Products]
    deletePost(id: ID!): String!
    updatePost(id: ID!, post: PostUpdate): Post
  }
`;

export default typeDefs;
