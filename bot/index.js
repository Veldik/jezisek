const Discord = require('discord.js');
const client = new Discord.Client();
const YTDL = require('ytdl-core');
const botconfig = require("./botconfig.json");
const songs = require("./songs.json");
var prefix = botconfig.prefix;
var songcount = Object.keys(songs.songs).length
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.on("ready", () => {
  console.log(`Bot byl zapnut, s ${client.users.size} uživateli, v ${client.channels.size} kanálech na ${client.guilds.size} serverech.`);
  client.user.setActivity(`Veselé Vánoce!`, { type: 'PLAYING' });
});

client.on("guildCreate", guild => {
  console.log(`Připojil jsem se na: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`Byl jsem vyhozen z: ${guild.name} (id: ${guild.id})`);
});

client.on('message', msg => {
  if(msg.author.bot) return;
  if(msg.channel instanceof Discord.DMChannel) return;
  if(msg.content.indexOf(botconfig.prefix) !== 0) return;
  const args = msg.content.slice(botconfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  //ping command
  if (command === 'ping') {
    const embed = new Discord.RichEmbed()
    .setAuthor("Ježíšek")
    .setTitle("Ping")
    .setColor(3447003)
    .setDescription("Ping? hmmm ne, Pong!")
    .setFooter("Ježíšek")
    .setTimestamp()
    msg.channel.send({embed})
  }
  //say command
  if (command === 'say' && msg.author.id == '187583136710918144'){
  const sayMessage = args.join(" ");
  msg.delete().catch(O_o=>{});
  msg.channel.send(sayMessage);
  }
  if (command === 'say' && msg.author.id != '187583136710918144'){
    const embed = new Discord.RichEmbed()
    .setTitle("Chyba")
    .setAuthor("Ježíšek")
    .setColor(15158332)
    .setDescription("Tento příkaz může používat pouze Velda.")
    .setFooter("Ježíšek")
    .setTimestamp()
    msg.channel.send({embed})
  }
  //play 24/7 command
  if (command === 'p24/7' || command === 'play24/7'){
    const embed = new Discord.RichEmbed()
    .setTitle("Chyba")
    .setAuthor("Ježíšek")
    .setColor(15158332)
    .setDescription("Tento příkaz zatím nefunguje, ale intenzivně se na něm pracuje.")
    .setFooter("Ježíšek")
    .setTimestamp()
    msg.channel.send({embed})
  }
  //list command
  if (command === 'list'){
    var list = "**List písniček**: \n";
    for(i=0; i < songcount; i++){
      list += "["+ i +"] **" + songs.songs[i].name + "** \n"

    }
    msg.channel.send(list)
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
    msg.channel.send({embed})
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
    msg.channel.send({embed})
  }
  //help command
  if (command === 'help'){
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
    msg.channel.send({embed})
  }
  //play command
  if (command === 'play' || command === 'p') {
    if (msg.member.voiceChannel){
      if (msg.guild.voiceConnection){
        const embed = new Discord.RichEmbed()
        .setTitle("Chyba")
        .setAuthor("Ježíšek")
        .setColor(15158332)
        .setDescription("Již hraji, musíš počkat než dohraji!")
        .setFooter("Ježíšek")
        .setTimestamp()
        msg.channel.send({embed})
      } else {
        let id = args.slice(0).join(' ');
        if (!id){
          //pouštění songu
          id = getRandomInt(songcount);
          msg.member.voiceChannel.join()
          .then(connection => {
              console.log('poustim songu');
              connection.playStream(YTDL('https://www.youtube.com/watch?v=' + songs.songs[id].id))
              .on('end', () => {
                  console.log('leavuju');
                  connection.channel.leave();
              })
              .catch(console.error);
          })
          .catch(console.error);
          const embed = new Discord.RichEmbed()
          .setAuthor("Ježíšek")
          .setColor(3447003)
          .setDescription("Náhodně jsem ti vybral písničku: **" + songs.songs[id].name + "**")
          .setFooter("Ježíšek")
          .setTimestamp()
          msg.channel.send({embed})
        } else if (id <= songcount){
          // pouštění songu
          msg.member.voiceChannel.join()
          .then(connection => {
              console.log('poustim songu');
              connection.playStream(YTDL('https://www.youtube.com/watch?v=' + songs.songs[0].id))
              .on('end', () => {
                  console.log('leavuju');
                  connection.channel.leave();
              })
              .catch(console.error);
          })
          .catch(console.error);
          const embed = new Discord.RichEmbed()
          .setAuthor("Ježíšek")
          .setColor(3447003)
          .setDescription("Písnička **" + songs.songs[id].name + "** začala úspěšně hrát.")
          .setFooter("Ježíšek")
          .setTimestamp()
          msg.channel.send({embed})
        } else {
          const embed = new Discord.RichEmbed()
          .setTitle("Chyba")
          .setAuthor("Ježíšek")
          .setColor(15158332)
          .setDescription("Nesprávné použití příkazu, napiš **j!play** pro spuštění náhodné písničky nebo **j!play 4** pro spuštění písničky podle ID!")
          .setFooter("Ježíšek")
          .setTimestamp()
          msg.channel.send({embed})
        }
      }
    } else {
      const embed = new Discord.RichEmbed()
      .setTitle("Chyba")
      .setAuthor("Ježíšek")
      .setColor(15158332)
      .setDescription("Musíš být připojen v kanále pro mluvení, abys mohl pustit písničku!")
      .setFooter("Ježíšek")
      .setTimestamp()
      msg.channel.send({embed})
    }
  };
});

client.login(botconfig.token);
