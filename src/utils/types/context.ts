import { User } from "@src/user/user-model";
import { Response, Request } from "express";
export interface Context {
  req: Request;
  res: Response;
  user: User;
}
