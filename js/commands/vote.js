var unirest = require('unirest');// rapid api sdk
module.exports = message => {
const embeds = {
  "title": "Vote for coming SOOON",
  "author": {
    "name": "coming SOOON!",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 53380,
  "footer": {
    "text": "coming SOOON! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "fields": [
    {
      "name": "Vote:",
      "value": "https://top.gg/bot/769171729729454100/vote",
      "inline": true
    }
  ]
}
message.reply({ embed : embeds })
 
};
