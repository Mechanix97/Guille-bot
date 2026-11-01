# Guille-bot
## Descripción
  Bot de Discord programado en Javascript utilizando el modulo [Discord.js](https://discord.js.org/#/) para interactuar con la API de Discord.
  
  Corre en Docker (Node 22 + ffmpeg).

## Cómo correrlo
1. En el [Discord Developer Portal](https://discord.com/developers/applications) → Bot: generar el token y activar **Message Content Intent**.
2. `cp .env.example .env` y poner el token en `DISCORD_TOKEN`.
3. `docker compose up -d --build`
4. Logs: `docker compose logs -f`

## Comandos 
- g!sonidos para ver lista de sonidos
- g!guillote para ver sorpresa 
- g!loquendo <texto> para reproducir como loquendo
- g!sentaste <USUARIO> para sentar a alguien
- g!dolar para saber la cotización del dolar
  
 ## Agregar a un Servidor
  [**Enlace**](https://discord.com/oauth2/authorize?client_id=713524519830028368&permissions=8&scope=bot%20applications.commands)
