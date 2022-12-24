import { GraphQLError } from "graphql";
import { AuthChecker } from "type-graphql";
import { Context } from "./types/context";
import { domain } from "./types/error-code";

// create auth checker function
export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  authorizedRoles
): boolean | Promise<boolean> => {
  const errorMsg = "Access Not Allowed";
  if (authorizedRoles?.length === 0) {
    // if `@Authorized()`, check only if user exists
    if (!user) {
      throw new GraphQLError(errorMsg, {
        extensions: { code: domain.FORBIDDEN },
      });
    } else return true;
  }

  // there are some roles defined now
  if (!user) {
    // and if no user, restrict access
    throw new GraphQLError(errorMsg, {
      extensions: { code: domain.FORBIDDEN },
    });
  }

  if (user.role?.some((role) => authorizedRoles.includes(role))) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  else {
    throw new GraphQLError(errorMsg, {
      extensions: { code: domain.FORBIDDEN },
    });
  }
};
