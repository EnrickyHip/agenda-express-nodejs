import axios from "axios";

export default async (email, password) => {
  const passwordMatches = await axios({
    method: "post",
    url: "/passwordMatches",
    data: {
      email,
      password,
    },
  });

  return passwordMatches.data;
};
