import { accessTokenExpiresIn, refreshTokenExpiresIn } from "./jwt";
import { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true, // very important for secrure API, this means no js can access the httpOnly cookie
  domain: "localhost",
  path: "/",
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

export const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: accessTokenExpiresIn * 60 * 1000,
  expires: new Date(Date.now() + accessTokenExpiresIn * 60 * 1000),
};

export const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: refreshTokenExpiresIn * 60 * 1000,
  expires: new Date(Date.now() + refreshTokenExpiresIn * 60 * 1000),
};
