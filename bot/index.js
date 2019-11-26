// DISCORD BOT JEŽÍŠEK
// GITHUB.COM/VELDIK

// nodejs modules
const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
//json import
const botconfig = require("./botconfig.json");
const songs = require("./songs.json");
//variables
const token = botconfig.token;
const prefix = botconfig.prefix;
var songcount = Object.keys(songs.songs).length
const queue = new Map();
//functions
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.on("ready", () => {
  console.log(`Bot byl zapnut, s ${client.users.size} uživateli, v ${client.channels.size} kanálech na ${client.guilds.size} serverech.`);
  client.user.setActivity(`Veselé Vánoce!`, { type: 'PLAYING' });
});

client.on("guildCreate", guild => {
  console.log(`Připojil jsem se na: ${guild.name} (id: ${guild.id}). Tato guilda má ${guild.memberCount} členů!`);
});

client.on("guildDelete", guild => {
  console.log(`Byl jsem vyhozen z: ${guild.name} (id: ${guild.id})`);
});

client.on('message', message => {
  if(message.author.bot) return;
  if(message.channel instanceof Discord.DMChannel) return;
  if(message.content.indexOf(botconfig.prefix) !== 0) return;
  const args = message.content.slice(botconfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const guildQueue = queue.get(message.guild.id);
  //ping command
  if (command === 'ping') {
    const embed = new Discord.RichEmbed()
    .setAuthor("Ježíšek")
    .setTitle("Ping")
    .setColor(3447003)
    .setDescription("Ping? hmmm ne, Pong!")
    .setFooter("Ježíšek")
    .setTimestamp()
    message.channel.send({embed})
  }
  //say command
  if (command === 'say' && message.author.id == '187583136710918144'){
  const saymessage = args.join(" ");
  message.delete().catch(O_o=>{});
  message.channel.send(saymessage);
  }
  if (command === 'say' && message.author.id != '187583136710918144'){
    const embed = new Discord.RichEmbed()
    .setTitle("Chyba")
    .setAuthor("Ježíšek")
    .setColor(15158332)
    .setDescription("Tento příkaz může používat pouze Velda.")
    .setFooter("Ježíšek")
    .setTimestamp()
    message.channel.send({embed})
  }
  //list command
  if (command === 'list' || command === 'l' || command === 'seznam'){
    var list = "**Seznam písniček**: \n";
    for(i=0; i < songcount; i++){
      list += "["+ i +"] **" + songs.songs[i].name + "** \n"
    }
    message.channel.send(list)
  }
  //about command
  if (command === 'about' || command === 'info'){
    const embed = new Discord.RichEmbed()
    .setAuthor("Ježíšek")
    .setTitle("O mně")
    .setColor(3447003)
    .setDescription("Naprogramoval mě **Velda**, nakreslila mě **3rr0rka** a umanul si mě nějakej **stařík**. Naučil jsem se hrát už **" + songcount + "** písniček. Právě obsluhuji **" + client.users.size + "** uživatelů na **"+client.guilds.size+"** serverech a můj kód můžeš najít [**ZDE**](https://github.com/veldik/jezisek) a můj web [**ZDE**](https://jezisek.velda.xyz).")
    .setThumbnail('https://cdn.discordapp.com/avatars/642795374150418438/82dde4117608945bbbfa0c24bd1adb9c.png?size=1280')
    .setFooter("Ježíšek")
    .setTimestamp()
    message.channel.send({embed})
  }
  //invite command
  if (command === 'invite' || command ==='inv'){
    const embed = new Discord.RichEmbed()
    .setAuthor("Ježíšek")
    .setTitle("Invite link")
    .setColor(3447003)
    .setDescription("Pozvi si Ježiška i na svůj Discord server! **[INVITE LINK](https://discordapp.com/oauth2/authorize?client_id=642795374150418438&scope=bot)**")
    .setFooter("Ježíšek")
    .setTimestamp()
    message.channel.send({embed})
  }
  //help command
  if (command === 'help' || command === 'h'){
    const embed = new Discord.RichEmbed()
        .setAuthor("Ježíšek")
        .setTitle("Nápověda")
        .setColor(3447003)
        .setDescription("Zde nalezneš všechny příkazy, které dokážu.")
        .addField("**j!play**", "Náhodně pustí písničku ze seznamu.", "false")
        .addField("**j!play 3**", "Pustí písničku podle ID ze seznamu.", "false")
        .addField("**j!play24/7**", "Budu hrát Vánoční songy nekonečně dlouho. (zatím nefunguje)", "false")
        .addField("**j!list**", "Zobrazí seznam písniček.", "false")
        .addField("**j!ping**", "Zahrajeme si ping-pong?", "false")
        .addField("**j!about**", "Základní informace o mně.", "false")
        .addField("**j!invite**", "Odkaz, aby sis mě mohl pozvat i na tvůj Discord server.", "false")
        .setFooter("Ježíšek")
        .setTimestamp()
    message.channel.send({embed})
  }
  if (command === 'play' || command === 'p'){
    execute(message, guildQueue);
    return;
  }
  if (command === 'skip' || command === 's'){
    skip(message, guildQueue)
    return;
  }
});

async function execute(message, guildQueue){
  const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) {
    const embed = new Discord.RichEmbed()
      .setTitle("Chyba")
      .setAuthor("Ježíšek")
      .setColor(15158332)
      .setDescription("Musíš být připojen v kanále pro mluvení, abys mohl pustit písničku!")
      .setFooter("Ježíšek")
      .setTimestamp()
      return message.channel.send({embed})
  }
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    const embed = new Discord.RichEmbed()
      .setTitle("Chyba")
      .setAuthor("Ježíšek")
      .setColor(15158332)
      .setDescription("Nemám práva na připojení nebo hraní v kanále, kde se právě nacházíš.")
      .setFooter("Ježíšek")
      .setTimestamp()
      return message.channel.send({embed})
	}

  let id = args[1];
  if (!id){
    id = getRandomInt(songcount);
  } else if (id < songcount){
    id = args[1];
  } else {
      const embed = new Discord.RichEmbed()
          .setTitle("Chyba")
          .setAuthor("Ježíšek")
          .setColor(15158332)
          .setDescription("Nesprávné použití příkazu, napiš **j!play** pro spuštění náhodné písničky nebo **j!play 4** pro spuštění písničky podle ID!")
          .setFooter("Ježíšek")
          .setTimestamp()
      return message.channel.send({embed})
  }

	const song = {
		title: songs.songs[id].name,
		url: "https://www.youtube.com/watch?v=" + songs.songs[id].id,
	};

	if (!guildQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;

			play(message.guild, queueContruct.songs[0]);
      console.log("Pouštím písničku na serveru: "+message.guild.name);
      const embed = new Discord.RichEmbed()
        .setAuthor("Ježíšek")
        .setColor(3447003)
        .setDescription("Písnička: **" + songs.songs[id].name + "** úspěšně začala hrát.")
        .setFooter("Ježíšek")
        .setTimestamp()
      return message.channel.send({embed})
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		guildQueue.songs.push(song);
    const embed = new Discord.RichEmbed()
      .setAuthor("Ježíšek")
      .setColor(3447003)
      .setDescription("Písnička: **" + songs.songs[id].name + "** byla úspěsně přidána do seznamu.")
      .setFooter("Ježíšek")
      .setTimestamp()
    return message.channel.send({embed})
	}
}

function skip(message, guildQueue) {
	if (!message.member.voiceChannel) {
    const embed = new Discord.RichEmbed()
        .setTitle("Chyba")
        .setAuthor("Ježíšek")
        .setColor(15158332)
        .setDescription("Musíš být v kanále pro mluvení, abys mohl pustit písničku.")
        .setFooter("Ježíšek")
        .setTimestamp()
    return message.channel.send({embed})
  }
	if (!guildQueue) {
    const embed = new Discord.RichEmbed()
        .setTitle("Chyba")
        .setAuthor("Ježíšek")
        .setColor(15158332)
        .setDescription("Nehraje žádná písnička, kterou bys mohl přeskočit.")
        .setFooter("Ježíšek")
        .setTimestamp()
    return message.channel.send({embed})
  }
	guildQueue.connection.dispatcher.end();
  const embed = new Discord.RichEmbed()
    .setAuthor("Ježíšek")
    .setColor(3447003)
    .setDescription("Písnička byla přeskočena.")
    .setFooter("Ježíšek")
    .setTimestamp()
  message.channel.send({embed});
}

function play(guild, song) {
	const guildQueue = queue.get(guild.id);

	if (!song) {
		guildQueue.voiceChannel.leave();
    const embed = new Discord.RichEmbed()
      .setAuthor("Ježíšek")
      .setColor(3447003)
      .setDescription("Dohrál jsem všechny písničky ze seznamu. \n Opouštím kanál.")
      .setFooter("Ježíšek")
      .setTimestamp()
      setTimeout(function() {
        guildQueue.textChannel.send({embed});
      }, 250);
      console.log("Opouštím server: "+guild.name);
		queue.delete(guild.id);
		return;
	}

	const dispatcher = guildQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Song dohrál!');
			guildQueue.songs.shift();
			play(guild, guildQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(guildQueue.volume / 5);
}

client.login(token);
