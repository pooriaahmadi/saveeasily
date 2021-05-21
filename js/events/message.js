const dao = require("../database/db")
//start of common commands
const commonCommands = ["d!help", "d!invite", "d!report", "d!start", "d!support", "d!vipabilities", "d!vote", "d!website", "d!ping"]
const ping = require('../commands/ping')
const help = require('../commands/help')
const invite = require('../commands/invite')
const report = require('../commands/report')
const start = require('../commands/start')
const support = require('../commands/support')
const vipabilities = require('../commands/vipabilities')
const vote = require('../commands/vote')
const website = require('../commands/website')
function runCommon(message, clientu) {
    let content = message.content
    if (content.startsWith(commonCommands[0])) {
        return help(message,commonCommands,dbCommands,devCommands)
    }
    if (content.startsWith(commonCommands[1])) {
        return invite(message)
    }
    if (content.startsWith(commonCommands[2])) {
        return report(message)
    }
    if (content.startsWith(commonCommands[3])) {
        return start(message)
    }
    if (content.startsWith(commonCommands[4])) {
        return support(message)
    }
    if (content.startsWith(commonCommands[5])) {
        return vipabilities(message)
    }
    if (content.startsWith(commonCommands[6])) {
        return vote(message)
    }
    if (content.startsWith(commonCommands[7])) {
        return website(message)
    }
    if (content.startsWith(commonCommands[8])) {
        return ping(message, clientu)
    }
}
// end of common commands
//start of db commands
const dbCommands = ["d!add", "d!edit", "d!profile", "d!remove", "d!search", "d!show", "d!download"]
const add = require('../commands/add')
const edit = require('../commands/edit')
const profile = require('../commands/profile')
const remove = require('../commands/remove')
const search = require('../commands/search')
const show = require('../commands/show')
const download = require('../commands/download')
async function rundb(message) {
    if (await dao.isExist(message.author.id) == 1) {
        if (message.channel.type == "dm") {
            if(await dao.isVip(message.author.id) == 1){
                if (message.content.startsWith("d!add")) {
                    return add(message)
                }
                if (message.content.startsWith("d!edit")) {
                    return edit(message)
                }
                if (message.content.startsWith("d!profile")) {
                    return profile(message)
                }
                if (message.content.startsWith("d!remove")) {
                    return remove(message)
                }
                if (message.content.startsWith("d!search")) {
                    return search(message)
                }
                if (message.content.startsWith("d!show")) {
                    return show(message)
                }
                if (message.content.startsWith("d!download")) {
                    return download(message)
                }
            }else{
                message.reply("Only VIP users can use RecordCommands in dm, use `d!vipabilities`")
            }
        } else {
            if (message.content.startsWith("d!add")) {
                return add(message)
            }
            if (message.content.startsWith("d!edit")) {
                return edit(message)
            }
            if (message.content.startsWith("d!profile")) {
                return profile(message)
            }
            if (message.content.startsWith("d!remove")) {
                return remove(message)
            }
            if (message.content.startsWith("d!search")) {
                return search(message)
            }
            if (message.content.startsWith("d!show")) {
                return show(message)
            }
            if (message.content.startsWith("d!download")) {
                return download(message)
            }
        }
    } else {
        message.reply("Please create an account using d!start")
    }
}
//end db commands
//start of dev commands
const devCommands = ["d!vipmake", "d!vipremove", "d!stats", "d!banadd", "d!banremove"]
const vipmake = require('../commands/vipmake')
const vipremove = require('../commands/vipremove')
const stats = require('../commands/stats')
const banadd = require('../commands/banadd')
const banremove = require('../commands/banremove')
function runDev(message,client) {
    if (message.content.startsWith("d!vipmake")) {
        return vipmake(message)
    }
    if (message.content.startsWith("d!vipremove")) {
        return vipremove(message)
    }
    if (message.content.startsWith("d!stats")) {
        return stats(message,client)
    }
    if (message.content.startsWith("d!banadd")) {
        return banadd(message,client)
    }
    if (message.content.startsWith("d!banremove")) {
        return banremove(message,client)
    }
}
//end of dev commands
const vipCommands = []
function checkCatgory(txt) {
    for (let i in commonCommands) {
        if (txt.startsWith(commonCommands[i])) {
            return "cc"
        }
    }
    for (let i in dbCommands) {
        if (txt.startsWith(dbCommands[i])) {
            return "dc"
        }
    }
    for (let i in vipCommands) {
        if (txt.startsWith(vipCommands[i])) {
            return "vc"
        }
    }
    for (let i in devCommands) {
        if (txt.startsWith(devCommands[i])) {
            return "dvc"
        }
    }
}

module.exports = async (client, message) => {

    if (message.content.startsWith('d!')) {
        if(await dao.isBanned(message.author.id) == 1){
            return message.reply("You are banned from bot, Contact at Pooria#2177")
        }
        if (await dao.isExist(message.author.id) == 1) {
            let commandUsed = await dao.getData(message.author.id, "commandUsed")
            commandUsed = commandUsed["commandUsed"]
            commandUsed++
            await dao.updateData(message.author.id, "commandUsed", commandUsed, 1)
        }
        cCategory = checkCatgory(message.content)
        if (cCategory == "cc") {
            runCommon(message, client)
        } else if (cCategory == "dc") {
            rundb(message)
        } else if (cCategory == "vc") {
            runVip(message)
        } else if (cCategory == "dvc") {
            if (await dao.isDev(message.author.id) == 1) {
                runDev(message,client)
            } else {
                message.reply("You are not a dev!")
            }
        } else {
            message.reply("Command not found! Use `d!help`")
        }


    }

}