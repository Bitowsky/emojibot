module.exports = (client, message => {
    command(client, ['a'], (message) => {
        message.channel.send("a")
    })
})

