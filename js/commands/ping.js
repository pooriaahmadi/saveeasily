module.exports = (message,client) => {
    message.reply(`:ping_pong:Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
}