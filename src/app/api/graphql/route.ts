import { createYoga } from "graphql-yoga";
import { createContext } from "@/graphql/context";
import { schema } from "@/graphql/schema";

const yoga = createYoga({
  schema,
  context: () => createContext(),
  graphqlEndpoint: "/api/graphql",
  // GraphiQL playground at /api/graphql, only outside production.
  graphiql: process.env.NODE_ENV !== "production",
  fetchAPI: { Response },
});

export function GET(request: Request) {
  return yoga.fetch(request);
}

export function POST(request: Request) {
  return yoga.fetch(request);
}

export function OPTIONS(request: Request) {
  return yoga.fetch(request);
}
