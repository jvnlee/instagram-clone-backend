import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword },
      { loggedInUser, protectResolver }
    ) => {
      protectResolver(loggedInUser);
      let hashedPassword = null;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      console.log(updatedUser);
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
