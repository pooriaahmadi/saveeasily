var Discord = require("discord.js")
const path = require('path')
const dao = require('../database/db')
const imgPath = path.resolve(__dirname, '../../files/help.png')
module.exports = async (message,common,db,dev) => {
const attachment = new Discord.Attachment(imgPath, 'help.png');
let commonCommands=""
for(let i in common){
  commonCommands = commonCommands+"`"+common[i]+"`,"
}
let dataCommand=""
for(let i in db){
  dataCommand = dataCommand+"`"+db[i]+"`,"
}
let devCommands=""
for(let i in dev){
  devCommands = devCommands+"`"+db[i]+"`,"
}
if(await dao.isDev(message.author.id)!=1){
  devCommands = "You're not premitted to see Dev Commands"
}
   const embeds = {
  "title": "Help:",
  "author": {
    "name": "Delta Bot!",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 53380,
  "footer": {
    "text": "Delta Bot! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
files: [
            attachment
        ],
        image: {
            url: 'attachment://help.png'
        },
  "fields": [
    {
      "name": "General Commands:("+common.length+")",
      "value": commonCommands,
      "inline": false
    },
    {
      "name": "Data Commands:("+db.length+")",
      "value": dataCommand,
      "inline": false
    }, 
    {
      "name": "Developer Commands:("+dev.length+")",
      "value": devCommands,
      "inline": false
    } ]
}
message.reply({ embed: embeds })
}