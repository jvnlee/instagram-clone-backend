import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword, token }
    ) => {
      // STEP1: take the changed data from the user, and if the password has a change, hash it.
      const { id } = await jwt.verify(token, process.env.SECRET_KEY);
      let hashedPassword = null;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: {
          id,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      if (updatedUser.id) {
        return {
          status: true,
        };
      } else {
        return {
          status: false,
          error: "Couldn't update profile.",
        };
      }
    },
  },
};
