

var Discord = require("discord.js")
const path = require('path')
const imgPath = path.resolve(__dirname, '../../files/vip.png')
module.exports = message => {
  const attachment = new Discord.Attachment(imgPath, 'vip.png');

  const embeds = {
    "title": "Vip abilities:",
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
      url: 'attachment://vip.png'
    },
    "fields": [
      {
        "name": "1:",
        "value": "You would be able to store more than 200 characters in 1 record",
        "inline": true
      },
      {
        "name": "2:",
        "value": "You would be able to use commands in bots dm",
        "inline": true
      },
      {
        "name": "3:",
        "value": "Vip rank in d!profile command",
        "inline": true
      }
    ]
  }
  message.reply({ embed: embeds })
}