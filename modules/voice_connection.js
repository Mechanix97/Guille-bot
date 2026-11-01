export { VoiceConnection };

import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	AudioPlayerStatus,
	VoiceConnectionStatus
} from '@discordjs/voice';

class VoiceConnection {
	static connected = false;
	connection = null;
	channel = null;

  	constructor(msg) {
  		this.channel = msg.member.voice.channel;
  	}

  	isConnected() {
  		return VoiceConnection.connected;
  	}

  	connect(attempt) {
  		return new Promise((resolve, reject) => {
			if(attempt == 0){
				reject('MAX ATTEMPTS')
			} else {
				if(attempt === undefined){
					attempt = 25;
				}
				if(this.channel == null){
					reject('No channel');
				} else{
					if(VoiceConnection.connected == true){
						setTimeout(() =>{
								this.connect(attempt - 1)
								.then((ret) => {resolve(ret); })
								.catch((err) => {reject(err);});
							} ,1000);
					} else {
						VoiceConnection.connected = true;
						const conn = joinVoiceChannel({
							channelId: this.channel.id,
							guildId: this.channel.guild.id,
							adapterCreator: this.channel.guild.voiceAdapterCreator
						});
						entersState(conn, VoiceConnectionStatus.Ready, 20000).then(() => {
							this.connection = conn;
							resolve();
						}).catch(e => {
							console.log(e);
							conn.destroy();
							VoiceConnection.connected = false;
							reject(e);
						});
				  }
				}
			}
    	});
  	}

	disconnect(){
		return new Promise((resolve) => {
			if(this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed){
				this.connection.destroy();
			}
			VoiceConnection.connected = false;
			resolve();
		});
	}

	playSound(file) {
		return new Promise((resolve, reject) => {
			const player = createAudioPlayer();
			this.connection.subscribe(player);
			player.play(createAudioResource(file));
			player.on(AudioPlayerStatus.Idle, () => {
				player.stop();
				resolve();
			});
			player.on('error', e =>{
				console.log(e);
				reject(e);
			});
			this.connection.on(VoiceConnectionStatus.Disconnected, () =>{
				resolve();
			});
		});
	}
}
