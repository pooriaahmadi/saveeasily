const db = require('../database/db')
module.exports = async message => {

    let result = await db.getSaveData(message.author.id)
    let content = message.content
    content = content.replace('d!edit ', '')
    const args = content.trim().split(/ +/g);
    if (content == args[0]) {
        return message.reply("Please input the new Content: ex. d!edit 1 Hi, im a new content!")
    }
    args[0] = args[0] - 1
    if (result[args[0]] == undefined) {
        return message.reply("Invalid ID, Please make sure by using d!show command.")
    } else {
        let oldData = result[args[0]]
        content = content.replace(args[0]+1 + " ", '')
        result[args[0]] = content
        if (await db.updateData(message.author.id,"savedata", result,0) == 0) {
            const embed = {
                "title": "Your data has been successfully edited!",
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
                        "name": "Old data:",
                        "value": oldData,
                        "inline": false
                    },
                    {
                        "name": "New data:",
                        "value": content,
                        "inline": false
                    }
                ]
            }
            message.reply({ embed: embed })
        }
    }
};