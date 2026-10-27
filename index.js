import { Command } from './modules/commands.js';

import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	]
});
let command = new Command();

// El token sale de DISCORD_TOKEN o, si no está, de bin/config.json
let token = process.env.DISCORD_TOKEN;
if(!token){
	token = JSON.parse(fs.readFileSync('./bin/config.json','utf-8')).token;
}

client.once('clientReady', () => {
	console.log('Conectado como ' + client.user.tag);
});

client.on('messageCreate', msg => {
	if(process.env.DEBUG) console.log('[msg] #' + (msg.channel && msg.channel.name) + ' ' + msg.author.username + ': ' + JSON.stringify(msg.content));
	if(msg.author.bot || !msg.guild) return;
	command.exec(msg, client);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  	//command.entranceCheck(oldMember, newMember);
});

// Muchas promesas de los comandos no tienen catch: en Node moderno eso tira abajo el proceso
process.on('unhandledRejection', err => console.error(err));
client.on('error', err => console.error(err));

// @discordjs/ws 1.x (el de discord.js 14) descarta un intento de conexión que tarda y le
// saca el onerror sin cerrarlo; cuando vence su handshake de 30s, ws emite 'error' sin
// nadie escuchando y Node tira abajo el proceso. Ese intento ya estaba abandonado y la
// librería reconecta sola, así que se ignora. Cualquier otro error sigue matando el
// proceso, para que Docker lo reinicie como antes.
process.on('uncaughtException', err => {
	if(err && err.message === 'Opening handshake has timed out'){
		console.error('Ignorado (intento de conexión descartado): ' + err.message);
		return;
	}
	console.error(err);
	process.exit(1);
});

// Si el login falla, salir para que Docker (restart: unless-stopped) lo reinicie
client.login(token).catch(err => {
	console.error(err);
	process.exit(1);
});
