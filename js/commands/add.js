const db = require('../database/db')
module.exports = async message => {
  let content = message.content
  content = content.replace('d!add ','');
if(content == "d!add"){
return message.reply("Please input a content!")
}
if(await db.addData(message.author.id,content) == 0){
  const embeds = {
    "title": "Successfully Added!",
    "description": "Your data has been successfully added!",
    "author": {
      "name": "Delta Bot!",
      "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
    },
    "color": 53380,
    "footer": {
      "text": "Delta Bot! | d!invite | d!support | d!report | d!help",
      "icon_url": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png"
    },
    "thumbnail": "https://cdn.discordapp.com/attachments/777113117607067659/777113162398695424/save.png",
    "fields": [
      {
        "name": "Data:",
        "value": "||"+content+"||",
        "inline": true
      }  ]
  }
  
  message.reply({ embed: embeds })
}else{
  message.reply("An error occured")
}


}
    
   