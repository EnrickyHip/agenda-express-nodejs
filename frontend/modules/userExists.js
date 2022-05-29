import axios from "axios";

export default async (email) => {
  try {
    const userExists = await axios({
      method: "post",
      url: "/userExists",
      data: {
        email,
      },
    });

    return userExists.data;
  } catch (error) {
    console.log(error);
  }
};
