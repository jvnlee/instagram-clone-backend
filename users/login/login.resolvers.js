import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // STEP1: find the user with the username(arg)
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          status: false,
          error: "User not found.",
        };
      }
      // STEP2: check the password(arg)
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          status: false,
          error: "Incorrect password.",
        };
      }
      // STEP3: issue a token, and send it to the user
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        status: true,
        token,
      };
    },
  },
};
