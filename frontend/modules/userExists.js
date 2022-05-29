import axios from "axios";

export default async (email) => {
  const userExists = await axios({
    method: "post",
    url: "/userExists",
    data: {
      email,
    },
  });

  return userExists.data;
};
