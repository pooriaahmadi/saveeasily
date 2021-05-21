const db = require('../database/db')
module.exports = async message => {
let content = message.content
content = content.replace("d!search ", '');
if(content == "d!search"){
  return message.reply("Please include a keyword! ex. `d!search saveeasily`")
}
content = content.toLowerCase()
let result = await db.getSaveData(message.author.id)
let msg = ""
 for(let i in result){
let search = result[i].toLowerCase()
let counter = 1
 if(search.includes(content) == true){
     msg = msg +'\n'+counter+" : "+result[i]
     counter++
}
}
if (msg == ""){
msg == "NO RECORD FOUND"
}
const embeds = {
  "title": "Search:",
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
      "name": "RESULTS:",
      "value": msg,
      "inline": true
    }
  ]
}
message.reply({ embed : embeds }).catch((err) => {
  message.reply("No record found!")
})

};
