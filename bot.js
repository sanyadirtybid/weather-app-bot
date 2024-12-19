const axios = require("axios");
const { Telegraf } = require("telegraf");

const TOKEN = "7929195743:AAEx5SmogGLC7m0toU9oEeXcJgp-HlDKwS8";
const bot = new Telegraf(TOKEN);
const Url =
  'http://api.weatherstack.com/current?access_key=38e13d379975120124b5bd79cf812ad4&query=';

const fetchData = async (cityName) => {
  try {
    const res = await axios.get(`${Url}${cityName}`);
    return res.data;
  } catch (error) {
    console.error("Ошибка при запросе данных о погоде:", error);
    return { success: false, error: error.message };
  }
};

bot.start((ctx) => {
  ctx.reply("Привет! Я бот, который предоставляет прогноз погоды. Выберите город:", {
    reply_markup: {
      keyboard: [
        [{ text: 'Нью-Йорк' }, { text: 'Москва' }],
        [{ text: 'Санкт-Петербург' }, { text: 'Лондон' }],
        [{ text: 'Помощь' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.on("text", async (ctx) => {
  const cityName = ctx.message.text;

  if (cityName === "Помощь") {
    ctx.reply("Введите название города или выберите один из предложенных вариантов.");
    return;
  }

  const data = await fetchData(cityName);

  if (data.success === false) {
    ctx.reply("Ошибка получения данных. Попробуйте еще раз или введите корректное название города.");
  } else {
    const { current, location } = data;
    const weatherStatus = current.weather_descriptions[0].toLowerCase();

    let weatherIcon = "❓";
    if (weatherStatus.includes("clear") || weatherStatus.includes("sunny")) {
      weatherIcon = "☀️";
    } else if (weatherStatus.includes("cloudy") || weatherStatus.includes("overcast")) {
      weatherIcon = "☁️";
    } else if (weatherStatus.includes("rain")) {
      weatherIcon = "🌧";
    } else if (weatherStatus.includes("snow")) {
      weatherIcon = "❄️";
    } else if (weatherStatus.includes("windy")) {
      weatherIcon = "💨";
    }

    ctx.reply(
      `🌆 Город: ${location.name}\n-\n🌡 Температура: ${current.temperature}°C\n-\n❓ Статус погоды: ${weatherIcon} ${current.weather_descriptions[0]}`
    );
  }
});

bot.launch();
