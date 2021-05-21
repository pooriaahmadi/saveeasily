module.exports = message => {
const embeds = {
  "title": "Invite SE bot!",
  "author": {
    "name": "Delta Bot!",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "color": 53380,
  "footer": {
    "text": "Delta Bot! | d!invite | d!support | d!report | d!help",
    "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
  },
  "fields": [
    {
      "name": "Invite directly:",
      "value": "https://discord.com/oauth2/authorize?client_id=769171729729454100&permissions=1074658497&scope=bot",
      "inline": true
    },
    {
      "name": "Invite via TOP.GG",
      "value": "https://top.gg/bot/769171729729454100/invite",
      "inline": true
    }
  ]
}
message.reply({ embed : embeds })
 
};
