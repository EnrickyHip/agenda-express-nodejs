import axios from "axios";

export default async (email, phone, id) => {
  try {
    const contactExists = await axios({
      method: "post",
      url: `/contactExists/${id}`,
      data: {
        email,
        phone,
      },
    });

    return contactExists.data;
  } catch (error) {
    console.log(error);
  }
};
