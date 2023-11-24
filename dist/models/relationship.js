"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const graphql_ogm_1 = require("@neo4j/graphql-ogm");
exports.User = new graphql_ogm_1.OGM({
    typeDefs: `
    type User {
      user_id: ID! @id
    }
  `,
});
//# sourceMappingURL=relationship.js.map