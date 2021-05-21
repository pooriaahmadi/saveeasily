const db = require('../database/db')
const path = require('path')
const fs = require('fs')
const htmlFilePath = path.resolve(__dirname, '../../files/savedata.html')
module.exports =async message => {
let result =await db.getSaveData(message.author.id)
let code = `<p style="text-align: center;"><span style="color: #00ccff;"><strong>Save Easily Bot</strong></span></p><p style="text-align: center;"><span style="color: #ff00ff;"><strong>This is your saved data from what you've been stored since you created your account! enjoy!</strong></span></p><hr />`
let msg=""
let counter=1
for (let i in result){
  msg = msg+'<p style="text-align: left;">'+counter+': '+result[i]+'</p>'  
  counter++
  }
code = "<html><title>Delta Bot!</title><body>"+code.concat(msg)+"</body></html>"
fs.writeFileSync(htmlFilePath, code);
message.reply("Here is your data!", { files: [htmlFilePath] })
};
