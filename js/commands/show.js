const db = require('../database/db')
module.exports = async message => {
  let result = await db.getSaveData(message.author.id)
  let finalResult = ""
  let counter =1
  for (let i in result) {
    finalResult = finalResult +'\n'+counter+" : "+result[i]
    counter++
  }
  if (finalResult == "" || finalResult == "1 :") {
    finalResult = "NO RECORD"
  }
  const embeds = {
    "title": "Show:",
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
        "name": "List:",
        "value": finalResult,
        "inline": true
      }
    ]
  }

  let content = message.content
  content = content.replace('d!show ', '');
  if (content == "private") {
    message.author.send("By using `d!show private` you accept to message you!.", { embed: embeds }).catch((err) => {
      message.reply("Your data is more than 2000 characters, Please use d!download")
    });
    message.reply(":e_mail: You have a mail DUDE!")
  } else {
    message.reply({ embed: embeds }).catch((err) => {
      message.reply("Your data is more than 2000 characters, Please use d!download")
    });
  }
};