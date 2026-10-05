import { createSchema } from "graphql-yoga";
import type { GraphQLContext } from "./context";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";

export const schema = createSchema<GraphQLContext>({ typeDefs, resolvers });
