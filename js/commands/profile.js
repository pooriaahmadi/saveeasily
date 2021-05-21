const db = require("../database/db")
module.exports = async message => {
let information = await db.getData(message.author.id, "*")
let isVip
let recordsCount = information["saveData"]
recordsCount =recordsCount.split(',');
recordsCount = recordsCount.length
if(information["isVip"] == 0){
  isVip = "False"
}else{
  isVip = "True"
}
const embeds = {
  "title": "Properties:",
  "author": {
    "name": message.author.username,
    "icon_url": message.author.avatarURL
  },
  "color": 53380,
  "footer": {
    "text": "delta bot! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://media.discordapp.net/attachments/777113117607067659/777113162398695424/save.png"
  },
  
  "fields": [
    {
      "name": "Name:",
      "value": message.author.tag,
      "inline": false
    },
    {
      "name": "Discord ID:",
      "value": message.author.id,
      "inline": false
    },
    {
      "name": "SE Account ID:",
      "value": information["id"],
      "inline": false
    },
    {
      "name": "Vip:",
      "value": isVip,
      "inline": false
    },
    {
      "name": "Records:",
      "value": recordsCount,
      "inline": true
    },
    {
      "name": "Commands Used:",
      "value": information["commandUsed"],
      "inline": true
    }
  ]
}

message.reply({ embed: embeds })
}
    
   