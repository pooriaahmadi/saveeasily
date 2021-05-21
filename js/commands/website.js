module.exports = message => {
const embeds = {
  "title": "Delta Bot Website!",
  "author": {
    "name": "Delta Bot!",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 53380,
  "footer": {
    "text": "Save Easily! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "fields": [
    {
      "name": "For irainian users:",
      "value": "coming SOOON",
      "inline": true
    },
    {
      "name": "For non irainian users",
      "value": "coming SOOON",
      "inline": true
    }
  ]
}
message.reply({ embed : embeds })
 
};
