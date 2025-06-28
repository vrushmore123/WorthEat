import path from "path";
import { promises as fs } from "fs";
import https from "https";

const WEATHER_API_KEY = "a20b0be12d000c0d0de0083058a365bc";

const getCurrentWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const weather = JSON.parse(data);
          const main = weather.weather?.[0]?.main?.toLowerCase();
          if (main?.includes("rain")) return resolve("rainy");
          if (main?.includes("clear")) return resolve("sunny");
          if (main?.includes("cloud")) return resolve("cloudy");
          if (main?.includes("snow")) return resolve("cold");
          return resolve("normal");
        } catch {
          return resolve("normal");
        }
      });
    }).on("error", () => resolve("normal"));
  });
};

const getTimeSlot = (time) => {
  const hour = new Date(time).getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

export const recommendDishes = async (city = "mumbai") => {
  try {
    const filePath = path.join(process.cwd(), "public/data/orders.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const orders = JSON.parse(fileData);

    const weather = await getCurrentWeather(city);
    const currentSlot = getTimeSlot(new Date());

    console.log("🌦️ Weather in", city, ":", weather);
    console.log("🕒 Time Slot:", currentSlot);

    const relevantOrders = orders.filter(
      (order) =>
        order.city?.toLowerCase() === city.toLowerCase() &&
        order.weather === weather
    );

    const slotFrequency = {};
    const globalFrequency = {};

    relevantOrders.forEach(({ food, time }) => {
      const slot = getTimeSlot(time);
      const key = `${food}-${slot}`;
      slotFrequency[key] = (slotFrequency[key] || 0) + 1;
      globalFrequency[food] = (globalFrequency[food] || 0) + 1;
    });

    const scoredDishes = Object.entries(slotFrequency)
      .filter(([key]) => key.endsWith(currentSlot))
      .map(([key, score]) => {
        const food = key.split("-")[0];
        const image = orders.find((o) => o.food === food)?.image;
        let extra = 0;

        if (weather === "rainy" && food.toLowerCase().includes("bhaji")) extra += 3;
        if (weather === "cold" && food.toLowerCase().includes("tikka")) extra += 2;
        if (weather === "sunny" && food.toLowerCase().includes("juice")) extra += 2;

        return { food, image, score: score + extra };
      })
      .filter((d) => d.image);

    if (scoredDishes.length === 0) {
      return Object.entries(globalFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([food]) => ({
          food,
          image: orders.find((o) => o.food === food)?.image,
          score: globalFrequency[food],
        }));
    }

    return scoredDishes.sort((a, b) => b.score - a.score).slice(0, 3);
  } catch (err) {
    console.error("❌ recommendDishes failed:", err);
    throw err;
  }
};
