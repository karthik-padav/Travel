import Cors from "micro-cors";
import dbConnect from "lib/dbConnect";

const cors = Cors({
  allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
export default cors(async function handler(req, res) {
  const { latitude, longitude } = { ...req?.query };
  if (latitude && longitude) {
    const API_KEY = "5c018098d783810191a3b46158c7382c";
    let resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`
    );
    if (resp.status === 200) {
      resp = await resp.json();
      res.json({ status: 200, data: resp });
      return;
    }
  }
  res.json({ status: 503, message: "Latitude or Longitude is missing." });
});
