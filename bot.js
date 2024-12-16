const axios = require("axios");
const { Telegraf } = require("telegraf");
// Этот токен был отозван, замените его на свой
const TOKEN = "7929195743:AAEx5SmogGLC7m0toU9oEeXcJgp-HlDKwS8";
const bot = new Telegraf(TOKEN);
const Url =
  'http://api.weatherstack.com/current?access_key=38e13d379975120124b5bd79cf812ad4&query=';

const fetchData = async (cityName) => {
  const res = await axios.get(`${Url}${cityName}`);
  return res.data;
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
      one_time_keyboard: false,  // Изменено на false, чтобы кнопки не исчезали
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
    ctx.reply("Введите корректное название города:");
  } else {
    const { current, location } = data;
    const weatherStatus = current.weather_descriptions[0];

    ctx.reply(
      `🌆 Город: ${location.name}\n-\n🌡 Температура: ${current.temperature}°C\n-\n❓ Статус погоды: ${
        (weatherStatus.toLowerCase().includes("Ясно") && "☀️") ||
        (weatherStatus.toLowerCase().includes("Солнечно") && "☀️") ||
        (weatherStatus.toLowerCase().includes("Облачно") && "☁️") ||
        (weatherStatus.toLowerCase().includes("Пасмурно") && "☁️") ||
        (weatherStatus.toLowerCase().includes("Дождь") && "🌧") ||
        (weatherStatus.toLowerCase().includes("Снег") && "❄️")
      } ${weatherStatus}`
    );
  }
});

bot.launch();