import { OGM } from "@neo4j/graphql-ogm";

export const User = new OGM({
  typeDefs: `
    type User {
      user_id: ID! @id
    }
  `,
});
