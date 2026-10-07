// previsao-tempo-chatbot: microserviço que expõe a previsão do tempo de três dias
// num formato simples para ser consumido por um chatbot via requisição HTTP.

import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * CONFIGURAÇÕES DO SERVIDOR
 */
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * CONFIGURAÇÕES DA API EXTERNA (WeatherAPI)
 */
const WEATHER_API_KEY: string = process.env.WEATHER_API_KEY ?? '';
if (!WEATHER_API_KEY) {
  throw new Error('Defina WEATHER_API_KEY no .env (veja .env.example).');
}
const LOCATION = process.env.LOCATION || 'Aurora';
const DAYS = 3; // Previsão para os três dias do evento
const LANG = 'pt';

/**
 * Função pura: monta a URL da WeatherAPI com base nos parâmetros fornecidos.
 * Mantém responsabilidade única e previsibilidade.
 */
const buildWeatherUrl = (
  key: string,
  location: string,
  days: number,
  lang: string
): string =>
  `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=${days}&lang=${lang}`;

/**
 * Função pura: formata a resposta da API externa para um formato limpo e amigável ao consumidor.
 * Extraí apenas os dados relevantes de cada dia da previsão.
 */
const formatWeatherResponse = (data: any) => {
  const { forecast, location } = data;

  const dias = forecast.forecastday.map((dia: any) => {
    return {
      data: dia.date,
      condicao: dia.day.condition.text,
      temperaturaMax: `${dia.day.maxtemp_c}°C`,
      temperaturaMin: `${dia.day.mintemp_c}°C`,
      chanceDeChuva: `${dia.day.daily_chance_of_rain}%`
    };
  });

  return {
    cidade: location.name,
    dias
  };
};

/**
 * Rota principal: /forecast
 * Responde com a previsão da cidade configurada para os próximos três dias.
 */
app.get('/forecast', async (_req: Request, res: Response) => {
  try {
    const url = buildWeatherUrl(WEATHER_API_KEY, LOCATION, DAYS, LANG);
    const { data } = await axios.get(url);
    const forecast = formatWeatherResponse(data);
    res.status(200).json(forecast);
  } catch (error) {
    console.error('Erro ao buscar previsão do tempo:', error);
    res.status(500).json({ erro: 'Erro ao buscar previsão do tempo.' });
  }
});

/**
 * Inicialização do servidor local
 * Para testar com um chatbot hospedado, exponha a porta com um túnel HTTPS (ex.: ngrok).
 */
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});