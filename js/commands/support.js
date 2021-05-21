var unirest = require('unirest');// rapid api sdk
module.exports = message => {
const embeds = {
  "title": "https://discord.gg/wUyA5m5XmH",
  "url": "https://discord.gg/wUyA5m5XmH",
  "author": {
    "name": "Delta Bot!",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 53380,
  "footer": {
    "text": "Delta Bot! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  }
}
message.reply({ embed : embeds })
 
};
