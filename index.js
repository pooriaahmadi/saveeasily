require('dotenv').config();
const fs = require('fs')
const dao = require('./js/database/db')
const path = require('path')
const tokenconfigpath = path.resolve(__dirname, './config.json')
const dblToken = ''
const { Client, Attachment } = require('discord.js');
const client = new Client();
let guildArray = client.guilds.array();
function getToken(){
  let rawdata = fs.readFileSync(tokenconfigpath);
  let tmpcnf = JSON.parse(rawdata);
  return tmpcnf["TOKEN"]
}
dao.connect()
client.on("guildCreate", guild => {

const embeds1 = {
  "title": "New Server!",
  "description": "New server has been added to list!",
  "author": {
    "name": "Delta Bot!",
    "icon_url": "https://media.discordapp.net/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 53380,
  "footer": {
    "text": "Delta Bot! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://media.discordapp.net/attachments/777113117607067659/777113162398695424/save.png"
  },
  "fields": [
    {
      "name": "Server name:",
      "value": guild.name,
      "inline": true
    }  ]
}
client.guilds.get('703417919295717517').channels.get('803282585307578378').send({ embed : embeds1 });
client.user.setActivity(`${client.guilds.size} servers | d!help`, { type: "WATCHING" })

    console.log("Joined a new guild: " + guild.name);
    //Your other stuff like adding to guildArray
})


client.on("guildDelete", guild => {
const channel = client.channels.get('777200698793394176')

const embeds2 = {
  "title": "Left Server!",
  "description": "A server has been removed from list!",
  "author": {
    "name": "Delta Bot!",
    "icon_url": "https://media.discordapp.net/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 3093151,
  "footer": {
    "text": "Delta Bot! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://media.discordapp.net/attachments/777113117607067659/777113162398695424/save.png"
  },
  "fields": [
    {
      "name": "Server name:",
      "value": guild.name,
      "inline": true
    }
     ]
}
client.guilds.get('703417919295717517').channels.get('803282585307578378').send({ embed : embeds2 });

client.user.setActivity(`${client.guilds.size} servers | d!help`, { type: "WATCHING" })

    console.log("Left a guild: " + guild.name);
    //remove from guildArray
})
fs.readdir('./js/events/', (err, files) => {
    files.forEach(file => {
        const eventHandler = require(`./js/events/${file}`)
        const eventName = file.split('.')[0]
        client.on(eventName, (...args) => eventHandler(client, ...args))
    })
})
//Top.gg counters log
const DBL = require("dblapi.js");
const dbl = new DBL(dblToken,client);
// Optional events
dbl.on('posted', () => {
  console.log('Server count posted!');
})
dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})

client.on("ready",async () => {
  client.user.setActivity(`${client.guilds.size} servers | d!help`, { type: "WATCHING" })
  setInterval(() => {
    dbl.postStats(client.guilds.size);
}, 1800000);
})

client.login(getToken());
