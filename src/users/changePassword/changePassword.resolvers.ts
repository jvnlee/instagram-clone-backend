import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";
import * as bcrypt from "bcrypt";

const resolvers: Resolvers = {
  Mutation: {
    changePassword: protectedResolver(
      async (_, { password, newPassword }, { client, loggedInUser }) => {
        const isValid = await bcrypt.compare(password, loggedInUser.password);
        if (!isValid) {
          return { status: false, error: "Incorrect password." };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            ...(hashedPassword && { password: hashedPassword }),
          },
        });
        if (updatedUser.id) {
          return { status: true };
        } else {
          return { status: false, error: "Password change has failed." };
        }
      }
    ),
  },
};

export default resolvers;
