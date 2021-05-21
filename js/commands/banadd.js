const db = require('../database/db')
module.exports =async message => {
    let content = message.content
    content = content.replace('d!banadd ', '');
    if(await db.isExist(content) == 0){
        return message.reply("User not found!")
    }else{
        if(await db.updateData(content, "isBanned", 1, 1) == 0){
            message.reply("User has been successfully made Banned")
        }else{
            message.reply("An error occured!")
        }
    }
}