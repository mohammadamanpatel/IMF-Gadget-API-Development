import jwt from "jsonwebtoken";
export const Get_Token = (Token_Obj) => {
  return jwt.sign(Token_Obj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
