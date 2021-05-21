//modules
const { create } = require('domain')
const fs = require('fs')
const mysql = require('mysql')
const path = require('path')
const add = require('../commands/add')
const banadd = require('../commands/banadd')
const mysqlconfigpath = path.resolve(__dirname, '../../config.json')
//Functions
let mysqlconfig = []
function getconfig() {
    let namearray = ["mysqlHost", "mysqlUser", "mysqlPassword", "mysqlDatabase"]
    let rawdata = fs.readFileSync(mysqlconfigpath);
    let tmpcnf = JSON.parse(rawdata);
    for (let i in namearray) {
        if (tmpcnf[namearray[i]] == undefined) {
            tmpcnf[namearray[i]] = ""
        }
        mysqlconfig.push(tmpcnf[namearray[i]])
    }
}
getconfig()
function createQuery(sql) {
    con.query("SELECT * FROM `users` WHERE isbanned = 0", function (err, result) {
        if (err) throw err;
        return result
    });
}

var con = mysql.createConnection({
    host: mysqlconfig[0],
    user: mysqlconfig[1],
    password: mysqlconfig[2],
    database: mysqlconfig[3]
});
function createQuery(sql) {
    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(JSON.stringify(result)));
        });

    });
}

const connect = () => {
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected to mysql database succesfully!");
    });
}
const disconnect = () => {
    con.end(function (err) {
        if (err) throw err;
        console.log("Disconnected from mysql Database");
    });
}
const isExist = async (userid) => {
    let result = await createQuery("SELECT * FROM `users` WHERE discordid = '" + userid + "'")
    result = result[0]
    if (result == undefined) {
        return 0
    } else {
        return 1
    }
}
const createAccount = async (userid) => {
    let result = await createQuery('INSERT INTO `users`(`discordid`, `isBanned`, `isDev`, `isVip`,`commandUsed`,`Votes`) VALUES ("' + userid + '",0,0,0,0,0)')
    if (result["warningCount"] == 0) {
        return 1
    } else {
        return 0
    }
}
const isVip = async (userid) => {
    let result = await createQuery('SELECT isVip FROM `users` WHERE discordid = "' + userid + '"')
    result = result[0]
    return result["isVip"]
}
const isDev = async (userid) => {
    let result = await createQuery('SELECT isDev FROM `users` WHERE discordid = "' + userid + '"')
    result = result[0]
    return result["isDev"]
}
const isBanned = async (userid) => {
    let result = await createQuery('SELECT isBanned FROM `users` WHERE discordid = "' + userid + '"')
    result = result[0]
    return result["isBanned"]
}
const addData = async (userid, content) => {
    let oldData = await createQuery('SELECT `savedata` FROM `users` WHERE discordid = "' + userid + '"')
    oldData = oldData[0]
    let result
    if (oldData["savedata"] == null) {
        result = await createQuery('UPDATE `users` SET `saveData`="' + content + '" WHERE discordid = "' + userid + '"')
    } else {
        content = oldData["savedata"] + "," + content
        result = await createQuery('UPDATE `users` SET `saveData`="' + content + '" WHERE discordid = "' + userid + '"')
    }
    return result["warningCount"]
}
const getSaveData = async (userid) => {
    let result = await createQuery('SELECT `savedata` FROM `users` WHERE discordid = "' + userid + '"')
    result = result[0]
    result = result["savedata"]
    if (result == null) {
        return ""
    }
    return result.split(',');
}
const updateData = async (userid, target, newData, int) => {
    if (int == 0) {
        let result = await createQuery('UPDATE `users` SET `' + target + '`="' + newData + '" WHERE discordid = "' + userid + '"')
        return result["warningCount"]
    }else if(int == 1){
        let result = await createQuery('UPDATE `users` SET `' + target + '`=' + newData + ' WHERE discordid = "' + userid + '"')
        return result["warningCount"]
    }
}
const getData = async (userid, name) => {
    if (name == "*") {
        let result = await createQuery('SELECT * FROM `users` WHERE discordid = "' + userid + '"')
        return result[0]
    } else {
        let result = await createQuery('SELECT `' + name + '` FROM `users` WHERE discordid = "' + userid + '"')
        return result[0]
    }
}
exports.isBanned = isBanned;
exports.getData = getData;
exports.updateData = updateData;
exports.getSaveData = getSaveData;
exports.addData = addData;
exports.isVip = isVip;
exports.createAccount = createAccount;
exports.connect = connect;
exports.disconnect = disconnect;
exports.isExist = isExist;
exports.isDev = isDev;
