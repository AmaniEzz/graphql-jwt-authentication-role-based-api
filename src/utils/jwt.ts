import jwt, { JsonWebTokenError } from "jsonwebtoken";
import config from "config";
import { GraphQLError } from "graphql";
import { domain } from "./types/error-code";

// Cookie Options
export const accessTokenExpiresIn = config.get<number>("accessTokenExpiresIn");
export const refreshTokenExpiresIn = config.get<number>(
  "refreshTokenExpiresIn"
);

export const accessTokenPrivateKey = Buffer.from(
  config.get<string>("accessTokenPrivateKey"),
  "base64"
).toString("ascii");

export const accessTokenPublicKey = Buffer.from(
  config.get<string>("accessTokenPublicKey"),
  "base64"
).toString("ascii");

export const refreshTokenPrivateKey = Buffer.from(
  config.get<string>("refreshTokenPrivateKey"),
  "base64"
).toString("ascii");

export const refreshTokenPublicKey = Buffer.from(
  config.get<string>("refreshTokenPublicKey"),
  "base64"
).toString("ascii");

export function signJwt(
  object: Object,
  privateKey: string,
  options?: jwt.SignOptions | undefined
): string {
  try {
    return jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  } catch (e) {
    throw new GraphQLError(e, {
      extensions: { code: domain.TOKEN_GENERATION_ERROR },
    });
  }
}

export function verifyJwt<T>(token: string, key: string): T {
  try {
    const decoded = jwt.verify(token, key) as T;
    return decoded;
  } catch (e) {
    throw new GraphQLError(e, {
      extensions: { code: domain.TOKEN_VERIFICATION_ERROR },
    });
  }
}
