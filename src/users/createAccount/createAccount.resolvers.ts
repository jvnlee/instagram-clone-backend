import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        // STEP1: check if the username or email are already on the DB.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("This username/email is already taken.");
        }
        // STEP2: hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // STEP3: save and return the user
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword,
          },
        });
        return {
          status: true,
        };
      } catch (error) {
        return {
          status: false,
          error: "Failed to create an account.",
        };
      }
    },
  },
};

export default resolvers;
