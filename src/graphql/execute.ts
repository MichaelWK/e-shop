import { graphql } from "graphql";
import { createContext, type GraphQLContext } from "./context";
import { schema } from "./schema";

/**
 * Run a GraphQL operation in-process. Server Components use this instead of
 * calling /api/graphql over HTTP, which would add a pointless network hop.
 */
export async function executeOperation<TData>(
  source: string,
  variables?: Record<string, unknown>,
  contextValue: GraphQLContext = createContext(),
): Promise<TData> {
  const result = await graphql({ schema, source, variableValues: variables, contextValue });

  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join("\n"));
  }
  return result.data as TData;
}
