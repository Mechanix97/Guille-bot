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

// Si el login falla, salir para que Docker (restart: unless-stopped) lo reinicie
client.login(token).catch(err => {
	console.error(err);
	process.exit(1);
});
