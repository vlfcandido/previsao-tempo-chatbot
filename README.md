# previsao-tempo-chatbot

Microserviço em TypeScript que consulta a WeatherAPI e devolve a previsão dos próximos três dias para uma cidade, num JSON enxuto pensado para ser lido por um fluxo de chatbot (condição, máxima, mínima e chance de chuva por dia).

Exercício técnico: o cenário era um bot de atendimento de um evento de três dias que precisava responder "como vai estar o tempo?" sem que o fluxo do bot tivesse de interpretar a resposta completa da API de clima.

## Como funciona

- `GET /forecast` monta a URL da WeatherAPI, busca a previsão e reduz a resposta ao que o bot exibe.
- `buildWeatherUrl` e `formatWeatherResponse` são funções puras; o handler só orquestra e trata erro (HTTP 500 com mensagem genérica).
- A chave da API vem do ambiente; o serviço não sobe sem ela.

Exemplo de resposta:

```json
{
  "cidade": "Aurora",
  "dias": [
    { "data": "2025-04-18", "condicao": "Ensolarado", "temperaturaMax": "27°C", "temperaturaMin": "18°C", "chanceDeChuva": "5%" },
    { "data": "2025-04-19", "condicao": "Parcialmente nublado", "temperaturaMax": "25°C", "temperaturaMin": "19°C", "chanceDeChuva": "20%" },
    { "data": "2025-04-20", "condicao": "Chuva leve", "temperaturaMax": "23°C", "temperaturaMin": "20°C", "chanceDeChuva": "60%" }
  ]
}
```

## Stack

Node.js 18+, TypeScript 5, Express 5, Axios, dotenv. Previsão pela [WeatherAPI](https://www.weatherapi.com/) (plano gratuito atende).

## Como rodar

```bash
npm install
cp .env.example .env     # preencha WEATHER_API_KEY; LOCATION e PORT são opcionais
npm start                # http://localhost:3000/forecast
```

Para ligar a um chatbot hospedado, exponha a porta com um túnel HTTPS (por exemplo `ngrok http 3000`) e aponte a requisição HTTP do fluxo para `/forecast`.

## Testes

Não há suíte de testes automatizados. `npm test` roda apenas a checagem de tipos (`tsc --noEmit`), que passa.

## Status

Concluído como exercício. Ficaram de fora: tratamento de erro específico por tipo de falha da API, cache da previsão e métricas.

## Licença

MIT.
