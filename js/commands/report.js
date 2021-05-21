const {Client,RichEmbed,Attachment} = require('discord.js');
module.exports = message => {
 let content = message.content
 content = content.replace('d!report ','');
if (content == "d!report"){
return message.reply("Please include a MESSAGE!")
}
try{ const channel = message.client.channels.get('803286796104368189')
channel.send("New report from ("+message.author.id+"  |  "+message.author.tag+") : "+content)
 }catch(e){console.log("[ERROR]",e)}
message.reply("Your report has been successfully sent to Admins!")
};