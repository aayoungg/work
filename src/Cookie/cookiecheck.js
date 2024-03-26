import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const ensureCookie = (name) => {
  let cookieValue = cookies.get(name);

  if (!cookieValue) {
    // If the cookie doesn't exist, set it with today's date
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    cookieValue = formattedDate;
  }

  return cookieValue;
};
