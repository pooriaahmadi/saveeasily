const db = require('../database/db')
module.exports = async message => {
     let content = message.content
     content = content.replace('!add ', '');

     const args = content.trim().split(/ +/g);
     if (args.length == 1) {
          message.reply("Please choose a number to delete(se!remove id)\n Use se!show to see list of records!")
     }
     if (args[1] == "all") {
          if (await db.updateData(message.author.id, "saveData", null, 1) == 0) {
               message.reply("All of your data has been successfully deleted!")
          }
     } else {
          let result = await db.getSaveData(message.author.id)
          if(result[args[1]-1]!=undefined){
               result.splice(args[1]-1, 1)
               if(await db.updateData(message.author.id, "savedata",result,0)==0){
                    message.reply("Your desired data has been successfully deleted!")
               }else{
                    message.reply("An error occured")
               }
          }else{
               message.reply("Invalid ID! Make sure using se!show command")
          }
     }
}
