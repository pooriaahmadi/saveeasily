const db = require('../database/db')
module.exports =async message => {
    let content = message.content
    content = content.replace('d!banremove ', '');
    if(await db.isExist(content) == 0){
        return message.reply("User not found!")
    }else{
        if(await db.updateData(content, "isBanned", 0, 1) == 0){
            message.reply("User has been successfully made Unbanned")
        }else{
            message.reply("An error occured!")
        }
    }
}