const db = require('../database/db')
module.exports = async message => {
    let result = await db.isExist(message.author.id)
    if(result == 0){
        result = await db.createAccount(message.author.id)
        console.log(result)
        if(result == 1){
            message.reply("Account Created successfully!")
        }else{
            message.reply("An error occured")
        }
    }else{
        message.reply("You already have a profile!")
    }
}
