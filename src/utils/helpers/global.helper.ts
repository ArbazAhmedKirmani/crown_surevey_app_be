const bcrypt = require("bcrypt");
import { QueryObjectProps } from "../interfaces/helper.interface";
import AppConfig from "../config/app.config";

const saltRounds = 10;

export const getQueryObject = (query: QueryObjectProps) => ({
  take: Number(query?.take) || AppConfig.QUERY.TOP,
  skip: Number(query?.skip) || AppConfig.QUERY.SKIP,
});

export const hashPassword = async (
  myPlaintextPassword: string
): Promise<string> => {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(
      myPlaintextPassword,
      saltRounds,
      function (err: unknown, hash: string) {
        if (err) reject(err);
        resolve(hash);
      }
    );
  });
};

export const comparePassword = (password: string, hash: string) => {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hash, function (err: unknown, result: boolean) {
      if (err) reject(err);
      resolve(result);
    });
  });
};
