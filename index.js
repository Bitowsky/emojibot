const Discord = require('discord.js')
const client = new Discord.Client()
const { MessageEmbed } = require('discord.js');
const config = require('./config.json')
const command = require('./commands.js')
var SelfReloadJSON = require('self-reload-json');
var data = new SelfReloadJSON('./data.json');
const regprof = require('./registerprofile.json')
const fs = require('fs');
const { ClientRequest } = require('http');
const { channel } = require('diagnostics_channel');
const { stringify } = require('querystring');
var points = 0
const trusted = require('./trusted.json')
const { Octokit } = require("@octokit/core");



//console.log(client)
const d = new Date();
let day = d.getDate();
let month = d.getMonth();
let year = d.getFullYear();

// Files with emotes data

const listemotes = require('./emotesdata/emotes.json')
const emotesinfo = require('./emotesdata/emotesinfo.json');
const emotesdup = require('./emotesdata/emotesduplicats.json')



// Shop

const shopitems = require('./shop/shopitems.json')
const shopset = require('./shop/shopsettings.json')
var itemidd


// Text
const itemsinfo = require('./text/itemsinfo.json')
const help = require('./text/helpinfo.json')
const statustext = require('./statustext.json')



// Logs

const logs = require('./logs.json');
const { start } = require('repl');
const { match } = require('assert');
console.log(`logs ${logs.data.length}`)

// Other

var turnoff = false;
var footertext = `${config.name}; Wersja ${config.ver}; ${config.author} 2022 (Testował: ${config.tester})`
//console.log(MessageEmbed)

// GitHub Crap

const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
//const fs = require('fs')

const dir = path.join(process.cwd(), 'test-clone')
git.clone({ fs, http, dir, url: 'https://github.com/Bitowsky/emojibot' }).then(console.log)








function logg(log, message) {
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    logs.data[logs.data.length] =  `/// <${day}.${month + 1}.${year} ${hour}:${minute}:${second}> <${message.channel.guild.name}/${message.channel.name}> ${log} ///`
    savestatelog(logs)
}

function logg2(log) {
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    logs.data[logs.data.length] =  `/// <${day}.${month + 1}.${year} ${hour}:${minute}:${second}> <SYSTEM> ${log} ///`
    //console.log(`FILE BEFORE: ${JSON.stringify(logs)}`)
    savestatelog(logs)
}


var dup = JSON.parse(JSON.stringify(emotesdup));
var refund = parseInt(Math.floor(Math.random() * (dup.refund[2 * 2] - dup.refund[2 * 2 - 1] + 1) + dup.refund[2 * 2 - 1]))

var items = 2; // Number of items

dup = JSON.parse(JSON.stringify(emotesdup));

//client.off()




client.on('ready', () => {
    
    console.log("ON")
    startlog()
    setTimeout(() => {
        logg2(`WŁĄCZONY`)
        refreshshop()
    },2000)
    var filebump = 0;
    setInterval(() => {
        filebump++;
        const d = new Date();
        let day = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        const channel = client.channels.cache.find(channel => channel.id == "931835888512692284")
        //var channel = "931835888512692284"
        channel.send(`${day}.${month}.${year} ${hour}:${minute}:${second} (${filebump})`, { files: ["./data.json"] });
        
    }, 5000);
    

    //if (turnoff == true) {
        
        statusid = 0;
        setInterval(() => {
            var statustextid = `text${statusid}`
            client.user.setActivity(`[Prefix: ${config.prefix}]\n${statustext.text[statusid]}`, { type: 'PLAYING' });
            statusid++;
            if (statusid >= statustext.text.length) {
                statusid = 0;
            }
        }, 10000);
    
        command(client, ['help'], (message) => {
            const helpmes = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Lista komend`)
                .addFields(
                    {name:`Podstawowe Komendy`, value: `${help.help1}`},
                    {name:`Komendy Emotkowe`, value: `${help.help2}`},
                    {name: `\u200B`, value: `${help.addinfo}`},
                )
                
                .addField(`\u200B`, "Prefix bota (znak, którym musisz rozpocząć komendę) to `" + config.prefix + "`")
                .setFooter(footertext)
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
            message.channel.send(helpmes)
        })

        command(client, ['register'], (message) => {
            logg(`Użyto komendę REGISTER przez ${message.author.username} (${message.author.id})`, message)
            var check = 1;
            var loop = 0;
            
            let regprof2 = JSON.parse(JSON.stringify(regprof));
            const myArray = JSON.parse(JSON.stringify(data.user));
            let arlength = data.user.length;
            
            myArray.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        const alreadyinbase = new MessageEmbed()
                            .setColor('#666666')
                            .setTitle(`Ale twoje ID już jest zarejestrowane!`)
                            .setFooter(footertext)
                        message.channel.send(alreadyinbase)
                        logg(`Próba rejestracji użytkownika ${message.author.username} (${message.author.id}): Niepowodzenie - Już w bazie`, message)
                    } else {
                        if (loop + 1 == arlength) {
                            data.user[loop + 1] = message.author.id;
                            data.emotes[loop + 1] = regprof.emotes;
                            data.inv[loop + 1] = regprof.inv
                            data.money[loop + 1] = regprof.money
                            data.freeaward[loop + 1] = regprof.freeaward
                            savestate(data);
                            const registered = new MessageEmbed()
                                .setColor('#999999')
                                .setTitle(`Zarejestrowano!`)
                                .setDescription(`Dzięki, że się zarejestrowałeś(aś) **${message.author.username}**! W nagrodę otrzymujesz:\n - ${regprof.inv[0]}x Losowa Emotka <:happypin:930475315086622720>\n - ${regprof.inv[1]}x Losowa Epicka Emotka <:epicpin:930089771127164929>\n - ${regprof.money} Emoticoinów <a:emoticoin:930438839829426186>\n\nŻyczymy miłego kolekcjonowania emotek!`)
                                .addField('\u200B', `Jeśli nie wiesz co dalej, skorzystaj z komendy ${config.prefix}help`)
                                .setFooter(footertext)
                            message.channel.send(registered)
                            logg(`Zarejestrowano nowego użytkownika: ${message.author.username} (${message.author.id})`, message)
                        }
                        //message.channel.send(`${check}`);
                    }
                }
                loop++
            });
        })

        command(client, ['ping'], (message) => {
            logg(`Użyto komendę PING przez ${message.author.username} (${message.author.id})`, message)
            //console.log(message.channel.guild.name)
            const pingmes = new MessageEmbed()
                .setColor('#005522')
                .setTitle(`Pong! :ping_pong:`)
                .setDescription(`Odpowiedziałem z prędkością **${Math.round(client.ws.ping)}ms**!`)
                .setFooter(footertext)
            message.channel.send(pingmes)
        })

        // Statystyki użytkownika

        command(client, ['emotes'], (message) => {
            logg(`Użyto komendę EMOTES przez ${message.author.username} (${message.author.id})`, message)
            var emoteslist = JSON.parse(JSON.stringify(listemotes.allemotes));
            var stats = JSON.parse(JSON.stringify(data));
            var check = 1;
            var loop = 1;
            var loop2 = 0;
            
            var stats = JSON.parse(JSON.stringify(data.user));
            
            //console.log(emoteslist)
            let arlength = data.user.length;
            let emotes = ""; // BITOWSKY
            let emotes2 = ""; // PIERRE
            let emotes3 = ""; // IVIP
            let emotes4 = ""; // KASETA GAMER
            let emotes5 = ""; // MEDPAN
            let emotes6 = ""; // TOBAJ
            let emotes7 = ""; // ROSE
            let emotes8 = ""; // JANEX
            let emotes9 = ""; // SZEŚCIOZŁOTÓWKA
            let minicount = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            stats.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        //message.channel.send(`Ale już jesteś zarejestrowany!`);
                        check = 0;
                        loop2 = 0;
                        total = 0;
                        data.emotes[parseInt(loop - 1)].forEach(cure => { 
                            //console.log(cure)
                            //console.log(loop2)
                            //console.log(emoteslist[loop2])
                            if (data.emotes[loop - 1][loop2] == 1) {
                                total++;
                            }
                            if (loop2 <= 8) { // BITOWSKY
                                if (cure == 0) {
                                    if (emotes == "") {
                                        emotes += ":question:"
                                    } else {
                                        emotes += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[0]++;
                                    if (emotes == "") {
                                        emotes += emoteslist[loop2][0]
                                    } else {
                                        emotes += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 9 && loop2 <= 17) { // PIERRE
                                if (cure == 0) {
                                    if (emotes2 == "") {
                                        emotes2 += ":question:"
                                    } else {
                                        emotes2 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[1]++;
                                    if (emotes2 == "") {
                                        emotes2 += emoteslist[loop2][0]
                                    } else {
                                        emotes2 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 18 && loop2 <= 26) { // IVIP
                                if (cure == 0) {
                                    if (emotes3 == "") {
                                        emotes3 += ":question:"
                                    } else {
                                        emotes3 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[2]++;
                                    if (emotes3 == "") {
                                        emotes3 += emoteslist[loop2][0]
                                    } else {
                                        emotes3 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 27 && loop2 <= 35) { // KASETA GAMER
                                if (cure == 0) {
                                    if (emotes4 == "") {
                                        emotes4 += ":question:"
                                    } else {
                                        emotes4 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[3]++;
                                    if (emotes4 == "") {
                                        emotes4 += emoteslist[loop2][0]
                                    } else {
                                        emotes4 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 36 && loop2 <= 44) { // MEDPAN
                                if (cure == 0) {
                                    if (emotes5 == "") {
                                        emotes5 += ":question:"
                                    } else {
                                        emotes5 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[4]++;
                                    if (emotes5 == "") {
                                        emotes5 += emoteslist[loop2][0]
                                    } else {
                                        emotes5 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 45 && loop2 <= 53) { // TOBAJ
                                if (cure == 0) {
                                    if (emotes6 == "") {
                                        emotes6 += ":question:"
                                    } else {
                                        emotes6 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[5]++;
                                    if (emotes6 == "") {
                                        emotes6 += emoteslist[loop2][0]
                                    } else {
                                        emotes6 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 54 && loop2 <= 62) { // ROSE
                                if (cure == 0) {
                                    if (emotes7 == "") {
                                        emotes7 += ":question:"
                                    } else {
                                        emotes7 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[6]++;
                                    if (emotes7 == "") {
                                        emotes7 += emoteslist[loop2][0]
                                    } else {
                                        emotes7 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 63 && loop2 <= 71) { // JANEX
                                if (cure == 0) {
                                    if (emotes8 == "") {
                                        emotes8 += ":question:"
                                    } else {
                                        emotes8 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[7]++;
                                    if (emotes8 == "") {
                                        emotes8 += emoteslist[loop2][0]
                                    } else {
                                        emotes8 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } else if (loop2 >= 72 && loop2 <= 80) { // SZEŚCIOZŁOTÓWKA
                                if (cure == 0) {
                                    if (emotes9 == "") {
                                        emotes9 += ":question:"
                                    } else {
                                        emotes9 += ", :question:"
                                    }
                                } else if (cure == 1) {
                                    minicount[8]++;
                                    if (emotes9 == "") {
                                        emotes9 += emoteslist[loop2][0]
                                    } else {
                                        emotes9 += `, ${emoteslist[loop2][0]}`
                                    }
                                }
                            } 
                            
                            //emotes += data.emotes[loop, loop2]
                            //message.channel.send(`${emotes}`)
                            if (loop2 == data.emotes[loop - 1].length - 1) {
                                //console.log(`${emotes}`)
                                //message.channel.send(`${emotes}`)
                                const emojistats = new MessageEmbed()
                                    .setColor('#0099ff')
                                    .setTitle(`Kolekcja emotek użytkownika ${message.author.username}`)
                                    .setDescription(`Posiadasz **${total}/${listemotes.allemotes.length}** emotek (${Math.floor((total/listemotes.allemotes.length)*100)}%)`)
                                    .addFields(
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[0][0]} (${minicount[0]}/${emotesinfo.repres[0][1]})`, value: `${emotes}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[1][0]} (${minicount[1]}/${emotesinfo.repres[1][1]})`, value: `${emotes2}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[2][0]} (${minicount[2]}/${emotesinfo.repres[2][1]})`, value: `${emotes3}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[3][0]} (${minicount[3]}/${emotesinfo.repres[3][1]})`, value: `${emotes4}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[4][0]} (${minicount[4]}/${emotesinfo.repres[4][1]})`, value: `${emotes5}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[5][0]} (${minicount[5]}/${emotesinfo.repres[5][1]})`, value: `${emotes6}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[6][0]} (${minicount[6]}/${emotesinfo.repres[6][1]})`, value: `${emotes7}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[7][0]} (${minicount[7]}/${emotesinfo.repres[7][1]})`, value: `${emotes8}` },
                                        { name: `Emotki przedstawiające ${emotesinfo.repres[8][0]} (${minicount[8]}/${emotesinfo.repres[8][1]})`, value: `${emotes9}` }
                                )
                                    .setFooter(footertext)
                                message.channel.send(emojistats)
                            }
                            
                            loop2++
                            
                        })
                    } else if (loop == stats.length) {
                        unregistered(message)
                        //message.channel.send(`${check}`);
                    }
                }
                loop++
            });
        })

        // Sprawdza ekwipunek użytkownika

        command(client, ['inv'], (message) => {
            logg(`Użyto komendę INV przez ${message.author.username} (${message.author.id})`, message)
            var check = 1;
            var loop = 0;
            var inv = JSON.parse(JSON.stringify(data));
            var inv2 = JSON.parse(JSON.stringify(data.inv));
            inv.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        //console.log(inv2[loop][0])
                        const invinfo = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Ekwipunek użytkownika ${message.author.username}`)
                        .addFields(
                            { name: "<:happypin:930475315086622720> Losowa Emotka", value: `Posiadasz: ${inv.inv[loop][0]}` },
                            { name: "<:epicpin:930089771127164929> Losowa Epicka Emotka", value: `Posiadasz: ${inv.inv[loop][1]}` },
                            { name: "\u200B", value:`Aby skorzystać z przedmiotu, użyj komendy ${config.prefix}use\nAby dowiedzieć się więcej o tych przedmiotach, skorzystaj z komendy ${config.prefix}itemsinfo`}
                        )
                        .setFooter(footertext)
                        message.channel.send(invinfo)
                        
                    } else if (loop == inv.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
        })

        command(client, ['use'], (message) => {
            logg(`Użyto komendę USE przez ${message.author.username} (${message.author.id})`, message)
            var usetimelimit = 30
            var check = 1;
            var loop = 0;
            var checkuser = JSON.parse(JSON.stringify(data));
            var inv = JSON.parse(JSON.stringify(data.inv));

            checkuser.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        let cando = addtobase(message.author.id, message, usetimelimit, "useitem");
                        if (cando == true) {
                            const useinfo = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`(${message.author.username}) Wpisz ID przedmiotu, który chcesz użyć.`)
                                .addFields(
                                    { name: "[ID: 1] <:happypin:930475315086622720> Losowa Emotka", value: `Posiadasz: ${inv[loop][0]}` },
                                    { name: "[ID: 2] <:epicpin:930089771127164929> Losowa Epicka Emotka", value: `Posiadasz: ${inv[loop][1]}` },
                                    { name: "\u200B", value:`Nieodpowiedzenie w przeciągu ${usetimelimit} sekund (lub skorzystanie z komendy ${config.prefix}cancel) będzie skutkowało anulowaniem komendy.`}
                                )
                                .setFooter(footertext)
                            message.channel.send(useinfo)
                        }
                    } else if (loop == checkuser.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
            
        })

        client.on('message', message => {
            //console.log(message.content)
            if (message.content == `${config.prefix}cancel` || message.content == `${config.prefix}anuluj`) {
                success = removefromactivedb(message)
                if (success == 1) {
                    const cancel = new MessageEmbed()
                        .setColor('#ee0000')
                        .setTitle(`Sesja Anulowana`)
                        .setFooter(footertext)
                        //.setDescription(`W tej chwili liczba posiadanego przedmiotu wynosi ${inv.inv[loop][0]}`)
                    const msg = message.channel.send(cancel)
                }

            } else {
            //let msg = message.content.toLowerCase();
            if (message.content != `${config.prefix}use` && message.content != `${config.prefix}buy`) {
                //console.log("1")
                var cando = sessionmessages1(message)
                //console.log("1")

                if (cando != 0) {
                    //console.log("3")
                    if (cando == "useitem") {
                        logg(`Do sesji ${cando}, utworzoną przez użytkownika ${message.author.username} (${message.author.id}) wprowadzono: ${message.content}`, message)
                        var check = 1;
                        loop = -1;
                        var userdata = JSON.parse(JSON.stringify(data));
                        userdata.user.forEach(curid => {
                            console.log(`1 loop ${loop}`)
                            if (check == 1) {
                                console.log(`1.5 loop ${loop}`)
                                loop++;
                                if (parseInt(curid) == message.author.id) {
                                    console.log(`2 loop ${loop} ${cando}`)
                                    console.log(`LOOP + ${loop}`)
                                    check = 0;
                                    var inv = JSON.parse(JSON.stringify(data));
                                    removefromactivedb(message)
                                    if (parseInt(message) <= items) {
                                        if (parseInt(message.content) == 1) { // LOSOWA EMOTKA
                                            if (inv.inv[loop][0] > 0) {
                                                console.log(`3 loop ${loop}`)
                                                inv.inv[loop][0]--;
                                                //console.log(`INV: ${JSON.stringify(inv)}`)
                                                savestate(inv);
                                                const usingitem = new MessageEmbed()
                                                    .setColor('#22eeff')
                                                    .setTitle(`<:happypin:930475315086622720> Losowanie Emotki... <:happypin:930475315086622720>`)
                                                    .setFooter(footertext)
                                                    //.setDescription(`W tej chwili liczba posiadanego przedmiotu wynosi ${inv.inv[loop][0]}`)
                                                const msg = message.channel.send(usingitem)
                                                .then ((msg) => {setTimeout(function(){
                                                    console.log(`4 loop ${loop}`)
                                                    const usingitem = new MessageEmbed()
                                                        .setColor('#22eeff')
                                                        .setTitle(`<:happypin:930475315086622720> Losowanie Emotki... <:happypin:930475315086622720>`)
                                                        .setDescription(`Trafiono...`)
                                                        .setFooter(footertext)
                                                    msg.edit(usingitem)
                                                    .then ((msg) => {setTimeout(function(){
                                                        gotwhat = getemoji(message)
                                                        console.log(`5 loop ${loop}`)
                                                        //console.log(`GOTWHAT: ${gotwhat}`)
                                                        addemotetoprofilevar = addemotetoprofile(gotwhat, message)
                                                        
                                                        if (addemotetoprofilevar == true) {
                                                            logg(`Wylosowanie Losowej Emotki przez ${message.author.username} (${message.author.id}): ${gotwhat}`, message)
                                                            const usingitem = new MessageEmbed()
                                                            .setColor('#22eeff')
                                                            .setTitle(`<:happypin:930475315086622720> Losowanie Emotki... <:happypin:930475315086622720>`)
                                                            .setDescription(`Trafiono...`)
                                                            .addFields(
                                                                {name:`${gotwhat}`, value:"\u200B"},
                                                                {name:`${gotwhatname}`, value: "\u200B", inline: true}
                                                            )
                                                            .setFooter(footertext)
                                                            msg.edit(usingitem)
                                                        } else {
                                                            dup = JSON.parse(JSON.stringify(emotesdup));
                                                            var refund = randomIntFromInterval(dup.refund[(gotwhatrar - 1) * 2], dup.refund[gotwhatrar* 2 - 1])
                                                            console.log(`6 loop ${loop}`)
                                                            data.money[loop] += refund;
                                                            savestate(data);
                                                            logg(`Wylosowanie Losowej Emotki przez ${message.author.username} (${message.author.id}): ${gotwhat} [DUPLIKAT: Zwrócono ${refund} Emoticoinów]`, message)
                                                            const usingitem = new MessageEmbed()
                                                            .setColor('#22eeff')
                                                            .setTitle(`<:happypin:930475315086622720> Losowanie Emotki... <:happypin:930475315086622720>`)
                                                            .setDescription(`Trafiono...`)
                                                            .addFields(
                                                                {name:`${gotwhat}!`, value:"\u200B"},
                                                                {name:gotwhatname, value: "\u200B", inline: true},
                                                                {name:`Duplikat! Zwrócono za niego ${refund} <a:emoticoin:930438839829426186>`, value:"\u200B"}
                                                            )
                                                            .setFooter(footertext)
                                                            msg.edit(usingitem)
                                                        }
                                                    }, 3000)})
                                                }, 3000)})
                                            } else {
                                                logg(`Błąd użycia przedmiotu LOSOWA EMOTKA przez ${message.author.username} (${message.author.id}): brak zasobów`, message)
                                                const notenough = new MessageEmbed()
                                                    .setColor('#ee2222')
                                                    .setTitle(`Brak przedmiotu`)
                                                    .setDescription(`Nie posiadasz tego przedmiotu.`)
                                                    .setFooter(footertext)
                                                message.channel.send(notenough)
                                            }
                                        } else if (parseInt(message.content) == 2) { // EPICKA EMOTKA
                                            if (inv.inv[loop][1] > 0) {
                                                inv.inv[loop][1]--;
                                                //console.log(`INV: ${JSON.stringify(inv)}`)
                                                savestate(inv);
                                                const usingitem = new MessageEmbed()
                                                    .setColor('#22eeff')
                                                    .setTitle(`<:epicpin:930089771127164929> Losowanie Epickiej Emotki <:epicpin:930089771127164929>`)
                                                    .setFooter(footertext)
                                                    //.setDescription(`W tej chwili liczba posiadanego przedmiotu wynosi ${inv.inv[loop][0]}`)
                                                const msg = message.channel.send(usingitem)
                                                .then ((msg) => {setTimeout(function(){
                                                    const usingitem = new MessageEmbed()
                                                        .setColor('#22eeff')
                                                        .setTitle(`<:epicpin:930089771127164929> Losowanie Epickiej Emotki <:epicpin:930089771127164929>`)
                                                        .setDescription(`Trafiono...`)
                                                        .setFooter(footertext)
                                                    msg.edit(usingitem)
                                                    .then ((msg) => {setTimeout(function(){
                                                        gotwhat = getepicemoji(message)
                                                        //console.log(`GOTWHAT: ${gotwhat}`)
                                                        addemotetoprofilevar = addemotetoprofile(gotwhat, message)
                                                        if (addemotetoprofilevar == true) {
                                                            logg(`Wylosowanie Losowej Epickiej Emotki przez ${message.author.username} (${message.author.id}): ${gotwhat}`, message)
                                                            const usingitem = new MessageEmbed()
                                                            .setColor('#22eeff')
                                                            .setTitle(`<:epicpin:930089771127164929> Losowanie Epickiej Emotki <:epicpin:930089771127164929>`)
                                                            .setDescription(`Trafiono...`)
                                                            .addFields(
                                                                {name:`${gotwhat}!`, value:"\u200B"},
                                                                {name:gotwhatname, value: "\u200B", inline: true}
                                                            )
                                                            .setFooter(footertext)
                                                            msg.edit(usingitem)
                                                        } else {
                                                            dup = JSON.parse(JSON.stringify(emotesdup));
                                                            //console.log(`${dup.refund[gotwhatrar * 2 - 1]} - ${dup.refund[(gotwhatrar - 1) * 2]}`) 
                                                            var refund = randomIntFromInterval(dup.refund[gotwhatrar * 2 - 1], dup.refund[(gotwhatrar - 1) * 2])
                                                            data.money[loop] += refund;
                                                            savestate(data);
                                                            logg(`Wylosowanie Losowej Epickiej Emotki przez ${message.author.username} (${message.author.id}): ${gotwhat} [DUPLIKAT: Zwrócono ${refund} Emoticoinów]`, message)
                                                            const usingitem = new MessageEmbed()
                                                            .setColor('#22eeff')
                                                            .setTitle(`<:happypin:930475315086622720> Losowanie Emotki... <:happypin:930475315086622720>`)
                                                            .setDescription(`Trafiono...`)
                                                            .addFields(
                                                                {name:`${gotwhat}!`, value:"\u200B"},
                                                                {name:gotwhatname, value: "\u200B", inline: true},
                                                                {name:`Duplikat! Zwrócono za niego ${refund} <a:emoticoin:930438839829426186>`, value:"\u200B"}
                                                            )
                                                            .setFooter(footertext)
                                                            msg.edit(usingitem)
                                                        }
                                                    }, 3000)})
                                                }, 3000)})
                                            } else {
                                                logg(`Błąd użycia przedmiotu LOSOWA EPICKA EMOTKA przez ${message.author.username} (${message.author.id}): brak zasobów`, message)
                                                const notenough = new MessageEmbed()
                                                    .setColor('#ee2222')
                                                    .setTitle(`Brak przedmiotu`)
                                                    .setDescription(`Nie posiadasz tego przedmiotu.`)
                                                    .setFooter(footertext)
                                                message.channel.send(notenough)
                                            }
                                        }
                                    } else {
                                        logg(`Błąd użycia przedmiotu przez ${message.author.username} (${message.author.id}): niepoprawne ID (wprowadzono: ${message.content})`, message)
                                        const incorrectid = new MessageEmbed()
                                        
                                            .setColor('#ee2222')
                                            .setTitle(`Niepoprawne ID przedmiotu`)
                                            .setDescription(`Podane ID nie pasuje do żadnego z przedstawionych przedmiotów. Upewnij się, że podałeś poprawny identyfikator (znajduje się on po lewej stronie każdego z przedmiotów).`)
                                            .setFooter(footertext)
                                        message.channel.send(incorrectid)
                                    }
                                } else {
                                    console.log(`LOOP - ${loop}`)
                                }
                                
                            }
                        })
                    } else if (cando == "buyitem") { // BUY AN ITEM
                        logg(`Do sesji ${cando}, utworzoną przez użytkownika ${message.author.username} (${message.author.id}) wprowadzono: ${message.content}`, message)
                        removefromactivedb(message)
                        check = 1;
                        loop = 0;
                        itemprice = 0;
                        var itemid = 0;
                        itemidd;
                        goon = true;
                        //console.log(`ITEMID = ${message.content}`)
                        //console.log(emote1)
                        if (message.content == "1") {
                            itemprice = emote1price
                            itemid = emote1 - 1
                            itemidd = 0;
                        } else if (message.content == "2") {
                            itemprice = emote2price
                            itemid = emote2 - 1
                            itemidd = 1
                        } else if (message.content == "3") {
                            itemprice = emote3price
                            itemid = emote3 - 1
                            itemidd = 2
                        } else if (message.content == "4") {
                            itemprice = emote4price
                            itemid = emote4 - 1
                            itemidd = 3
                        } else if (message.content == "5") {
                            itemprice = special1price
                            itemid = special1
                            itemidd = 4
                        } else {
                            goon = false;
                        }
                        
                        if (goon == true) {
                            var userdata = JSON.parse(JSON.stringify(data));
                            userdata.user.forEach(curid => {
                                if (check == 1) {
                                    if (parseInt(curid) == message.author.id) {
                                        check = 0
                                        //console.log(`CASH: ${userdata.money[loop]} PRICE: ${itemprice}`)
                                        if (userdata.money[loop] >= itemprice) {
                                            if (itemidd <= 3) {
                                                ifnotdup = shopdup(message, itemid)
                                                if (ifnotdup == true) {
                                                    userdata.money[loop] -= itemprice
                                                    userdata.emotes[loop][itemid] = 1
                                                    savestate(userdata)
                                                    logg(`Zakupiono przez użytkownika ${message.author.username} (${message.author.id}) przedmiot ${listemotes.allemotes[itemid][2]} za ${itemprice} emoticoinów`, message)
                                                    const buyed = new MessageEmbed()
                                                        .setColor('#00ee00')
                                                        .setTitle(`Zakupiono!`)
                                                        .setDescription(`Pomyślnie zakupiono **${listemotes.allemotes[itemid][2]} ${listemotes.allemotes[itemid][0]}** za **${itemprice} <a:emoticoin:930438839829426186>**!`)
                                                        .setFooter(footertext)
                                                    message.channel.send(buyed)
                                                } else {
                                                    cantbuydup(message, itemid)
                                                }
                                            } else if (itemidd == 4 || itemidd == 5) {
                                                userdata.money[loop] -= itemprice
                                                userdata.inv[loop][shopitems.stuff[special1][4]]++
                                                savestate(userdata)
                                                logg(`Zakupiono przez użytkownika ${message.author.username} (${message.author.id}) przedmiot ${shopitems.stuff[special1][2]} za ${itemprice} emoticoinów`, message)
                                                const buyed = new MessageEmbed()
                                                    .setColor('#00ee00')
                                                    .setTitle(`Zakupiono!`)
                                                    .setDescription(`Pomyślnie zakupiono **${shopitems.stuff[special1][2]} ${shopitems.stuff[special1][3]}** za **${itemprice} <a:emoticoin:930438839829426186>**! Przedmiot został dodany do twojego ekwipunka (${config.prefix}inv)`)
                                                    .setFooter(footertext)
                                                message.channel.send(buyed)
                                            }
                                            itemidd = 0;
                                        } else {
                                            notenoughmoney(message, userdata)
                                        }
                                    }
                                loop++;
                                }
                            })
                        } else {
                            logg(`Błąd kupienia przedmiotu przez ${message.author.username} (${message.author.id}): niepoprawne ID (wprowadzono: ${message.content})`, message)
                            const incorrectid = new MessageEmbed()
                                .setColor('#ee2222')
                                .setTitle(`Niepoprawne ID przedmiotu`)
                                .setDescription(`Podane ID nie pasuje do żadnego z przedstawionych przedmiotów. Upewnij się, że podałeś poprawny identyfikator (znajduje się on po lewej stronie każdego z przedmiotów).`)
                                .setFooter(footertext)
                            message.channel.send(incorrectid)
                            goon = true;
                        }
                        
                    }
                } 
            }
        }   
        })
        
        /*
        command(client, ['f'], (message) => {
            let mes = test()
            message.channel.send(mes)
        })*/

        command(client, ['money'], (message) => {
            logg(`Użyto komendę MONEY przez ${message.author.username} (${message.author.id})`, message)
            var check = 1;
            var loop = 0;
            //var money = JSON.parse(JSON.stringify(data));
            var money = JSON.parse(JSON.stringify(data.money));
            data.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        const moneyinfo = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Stan konta użytkownika ${message.author.username}`)
                        .addFields(
                            { name: `Posiadasz: ${money[loop]} <a:emoticoin:930438839829426186>`, value: `\u200B` }
                        )
                        .setFooter(footertext)
                        message.channel.send(moneyinfo)
                        
                    } else if (loop == data.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
        })
        
        /*
        command(client, ['money'], (message) => {
            var check = 1;
            var loop = 0;
            //var money = JSON.parse(JSON.stringify(data));
            var money = JSON.parse(JSON.stringify(data.money));
            data.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        const moneyinfo = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Stan konta użytkownika ${message.author.username}`)
                        .addFields(
                            { name: `Posiadasz: ${money[loop]} <a:emoticoin:930438839829426186>`, value: `\u200B` }
                        )
                        message.channel.send(moneyinfo)
                        
                    } else if (loop == data.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
        })
        */



        // SHOP
        command(client, ['shop'], (message) => {
            logg(`Użyto komendę SHOP przez ${message.author.username} (${message.author.id})`, message)
            check = 1
            loop = 0
            dupemote = ["", "", "", "", ""]
            data.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        dupemote = dupinshop(message, dupemote, loop)
                        //console.log(`dupemote: ${dupemote}`)
                        const moneyinfo = new MessageEmbed()
                        .setColor('#335533')
                        .setTitle(`Sklep`)
                        .setDescription(`Aby zakupić jakiś przedmiot, skorzystaj z komendy **${config.prefix}buy**\nW tej chwili posiadasz **${data.money[loop]} <a:emoticoin:930438839829426186>**`)
                        .addFields(
                            { name: `Emotki Dnia:`, value: `${listemotes.allemotes[emote1 - 1][0]} - ${dupemote[0]}${listemotes.allemotes[emote1 - 1][2]} (${emote1rarname}) - ${emote1price} <a:emoticoin:930438839829426186>\n${listemotes.allemotes[emote2 - 1][0]} - ${dupemote[1]}${listemotes.allemotes[emote2 - 1][2]} (${emote2rarname}) - ${emote2price} <a:emoticoin:930438839829426186>\n${listemotes.allemotes[emote3 - 1][0]} - ${dupemote[2]}${listemotes.allemotes[emote3 - 1][2]} (${emote3rarname}) - ${emote3price} <a:emoticoin:930438839829426186>\n${listemotes.allemotes[emote4 - 1][0]} - ${dupemote[3]}${listemotes.allemotes[emote4 - 1][2]} (${emote4rarname}) - ${emote4price} <a:emoticoin:930438839829426186>` },
                            { name: `Specjalne Przedmioty Dnia:`, value: `${shopitems.stuff[special1][3]} - ${shopitems.stuff[special1][2]} - ${shopitems.stuff[special1][1]} <a:emoticoin:930438839829426186>`},
                            { name: `\u200B`, value: `Oznaczenie ${dupinchatsign}oznacza, że już posiadasz tą emotkę. Nie możesz teraz jej kupić ponownie.`},
                            { name: `\u200B`, value: `Sklep odświeża się codziennie o ${shopset.refreshhour}:${shopset.refreshminute}`}
                        )
                        .setFooter(footertext)
                        
                        message.channel.send(moneyinfo)
                        
                    } else if (loop == data.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
        })

        command(client, ['buy'], (message) => {
            logg(`Użyto komendę BUY przez ${message.author.username} (${message.author.id})`, message)
            var usetimelimit = 30

            var check = 1;
            var loop = 0;
            var checkuser = JSON.parse(JSON.stringify(data));
            var inv = JSON.parse(JSON.stringify(data.inv));

            checkuser.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        let cando = addtobase(message.author.id, message, usetimelimit, "buyitem");
                        if (cando == true) {
                            const buyinfo = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`(${message.author.username}) Wpisz ID przedmiotu, który chcesz kupić.\nW tej chwili posiadasz **${data.money[loop]} <a:emoticoin:930438839829426186>**`)
                                .addFields(
                                    { name: `Emotki Dnia:`, value: `[ID: 1] ${listemotes.allemotes[emote1 - 1][0]} - ${listemotes.allemotes[emote1 - 1][2]} (${emote1rarname}) - ${emote1price} <a:emoticoin:930438839829426186>\n[ID: 2] ${listemotes.allemotes[emote2 - 1][0]} - ${listemotes.allemotes[emote2 - 1][2]} (${emote2rarname}) - ${emote2price} <a:emoticoin:930438839829426186>\n[ID: 3] ${listemotes.allemotes[emote3 - 1][0]} - ${listemotes.allemotes[emote3 - 1][2]} (${emote3rarname}) - ${emote3price} <a:emoticoin:930438839829426186>\n[ID: 4] ${listemotes.allemotes[emote4 - 1][0]} - ${listemotes.allemotes[emote4 - 1][2]} (${emote4rarname}) - ${emote4price} <a:emoticoin:930438839829426186>` },
                                    { name: `Specjalne Przedmioty Dnia:`, value: `[ID: 5] ${shopitems.stuff[special1][3]} - ${shopitems.stuff[special1][2]} - ${shopitems.stuff[special1][1]} <a:emoticoin:930438839829426186>`},
                                    { name: "\u200B", value:`Nieodpowiedzenie w przeciągu ${usetimelimit} sekund (lub skorzystanie z komendy ${config.prefix}cancel) będzie skutkowało anulowaniem komendy.`}
                                    )
                                .setFooter(footertext)
                                
                            message.channel.send(buyinfo)
                        }
                    } else if (loop == checkuser.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
            
        })

        command(client, ['itemsinfo'], (message) => {
            logg(`Użyto komendę ITEMSINFO przez ${message.author.username} (${message.author.id})`, message)
            check = 1
            loop = 0
            data.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        var normaldrop = 100 - rareemojidrop
                        var mes1 = itemsinfo.aboutrandpin.replace("{0}", normaldrop)
                        var mes1 = mes1.replace("{2}", ((rareemojidrop/1000) * (10 * epicemojidrop)))
                        var mes1 = mes1.replace("{1}", (100 - normaldrop - ((rareemojidrop/1000) * (10 * epicemojidrop))))
                        const itemsinfomes = new MessageEmbed()
                        .setColor('#335533')
                        .setTitle(`Informacje o przedmiotach`)
                        .addFields(
                            { name: `<:happypin:930475315086622720> Losowa Emotka`, value: `${mes1}`},
                            { name: `<:epicpin:930089771127164929> Losowa Epicka Emotka`, value: `${itemsinfo.aboutepicpin}`},
                            { name: `\u200B`, value: `\u200B`},
                            { name: `Dodatkowe informacje o emotkach:`, value: `${itemsinfo.aboutpins}`},
                        )
                        .setFooter(footertext)
                        
                        message.channel.send(itemsinfomes)
                        
                    } else if (loop == data.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
        })

        command(client, ['freeaward'], (message) => {
            logg(`Użyto komendę FREEAWARD przez ${message.author.username} (${message.author.id})`, message)
            var check = 1
            loop = -1
            data.user.forEach(curid => {
                if (check == 1) {
                    loop++;
                    if (parseInt(curid) == message.author.id) {
                        check = 0
                        if (data.freeaward[loop] == 1) {
                            
                            data.freeaward[loop] = 0
                            savestate(data)
                            freeawardname = freeawardrandom(message, loop)
                            logg(`Darmowa nagroda dla ${message.author.username} (${message.author.id}): ${freeawardname}`, message)
                            const freeawardclaimed = new MessageEmbed()
                                .setColor('#335533')
                                .setTitle(`Odebrano darmową nagrodę`)
                                .setDescription(`Otrzymano ${freeawardname}\n\nWróć jutro ponownie wraz z odświeżeniem sklepu (${shopset.refreshhour}:${shopset.refreshminute})`)
                                .setFooter(footertext)
                            message.channel.send(freeawardclaimed)
                        } else {
                            const freeawardclaimed = new MessageEmbed()
                                .setColor('#335533')
                                .setTitle(`Już odebrałeś(aś) swoją darmową nagrodę!`)
                                .setDescription(`Wróć jutro ponownie wraz z odświeżeniem sklepu (${shopset.refreshhour}:${shopset.refreshminute})`)
                                .setFooter(footertext)
                            message.channel.send(freeawardclaimed)
                        }
                    } else if (loop == data.user.length - 1) {
                        unregistered(message)
                    }
                }
                
            })
        })

        command(client, ['info'], (message) => {
            logg(`Użyto komendę INFO przez ${message.author.username} (${message.author.id})`, message)
            const info = new MessageEmbed()
                .setColor('#335533')
                .setTitle(`**EMOJI BOT - Kolekcjonuj emotki!**`)
                .setDescription(`Zbieraj emotki do swojej kolekcji. W jakim celu? Dla zabawy!\n\nPonad 80+ emotek do zebrania!\n\nZwykłe, rzadkie i epickie! Im wyższa rzadkość, tym większa satysfakcja!\n\nOdwiedzaj codziennie sklep po nowe oferty i wydawaj swoje Emoticoiny na cenne emotki! <a:emoticoin:930438839829426186>\n\nZbieraj darmowe nagrody za...ciągłe branie udziału w zabawie?\n\nAby rozpocząć swoją przygodę, użyj komendy **${config.prefix}register**!`)
                .addField(`\u200B`,`Aktualna wersja: ${config.ver}`)
                .setImage('https://i.ibb.co/NKkjnbV/emojibotad.gif')
                .setFooter(footertext)
                
            message.channel.send(info)
        })

        /*
        command(client, ['sell'], (message) => {
            logg(`Użyto komendę SELL przez ${message.author.username} (${message.author.id})`, message)
            var usetimelimit = 30

            var check = 1;
            var loop = 0;
            var checkuser = JSON.parse(JSON.stringify(data));
            var inv = JSON.parse(JSON.stringify(data.inv));

            checkuser.user.forEach(curid => {
                if (check == 1) {
                    if (parseInt(curid) == message.author.id) {
                        check = 0;
                        let cando = addtobase(message.author.id, message, usetimelimit, "sellitem");
                        if (cando == true) {
                            const buyinfo = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(`(${message.author.username}) Wpisz ID przedmiotu, który chcesz kupić.\nW tej chwili posiadasz **${data.money[loop]} <a:emoticoin:930438839829426186>**`)
                                .addFields(
                                    { name: `Emotki Dnia:`, value: `[ID: 1] ${listemotes.allemotes[emote1 - 1][0]} - ${listemotes.allemotes[emote1 - 1][2]} (${emote1rarname}) - ${emote1price} <a:emoticoin:930438839829426186>\n[ID: 2] ${listemotes.allemotes[emote2 - 1][0]} - ${listemotes.allemotes[emote2 - 1][2]} (${emote2rarname}) - ${emote2price} <a:emoticoin:930438839829426186>\n[ID: 3] ${listemotes.allemotes[emote3 - 1][0]} - ${listemotes.allemotes[emote3 - 1][2]} (${emote3rarname}) - ${emote3price} <a:emoticoin:930438839829426186>\n[ID: 4] ${listemotes.allemotes[emote4 - 1][0]} - ${listemotes.allemotes[emote4 - 1][2]} (${emote4rarname}) - ${emote4price} <a:emoticoin:930438839829426186>` },
                                    { name: `Specjalne Przedmioty Dnia:`, value: `[ID: 5] ${shopitems.stuff[special1][3]} - ${shopitems.stuff[special1][2]} - ${shopitems.stuff[special1][1]} <a:emoticoin:930438839829426186>`},
                                    { name: "\u200B", value:`Nieodpowiedzenie w przeciągu ${usetimelimit} sekund (lub skorzystanie z komendy ${config.prefix}cancel) będzie skutkowało anulowaniem komendy.`}
                                    )
                                
                            message.channel.send(buyinfo)
                        }
                    } else if (loop == checkuser.user.length - 1) {
                        unregistered(message)
                    }
                }
                loop++;
            })
            
        })
        */
    

    // OUT OF TURN OFF MESSAGE

    if (turnoff == true) {
        //client.user.setActivity(`BOT PRZESZEDŁ W TRYB PRZERWY KONSERWACYJNEJ. WRÓĆ PÓŹNIEJ`, { type: 'PLAYING' });
        client.user.setPresence({
            status: "dnd",  // You can show online, idle... Do not disturb is dnd
            game: {
                name: "BOT PRZESZEDŁ W TRYB PRZERWY KONSERWACYJNEJ. WRÓĆ PÓŹNIEJ",  // The message shown
                type: "PLAYING" // PLAYING, WATCHING, LISTENING, STREAMING,
            }
        });
    }

    client.on('message', message => {
        var trusted2 = JSON.parse(JSON.stringify(trusted.trusted));
        //console.log(`TRUSTED ${trusted2}`)
        trusted2.forEach(curid => {
            if (parseInt(curid) == message.author.id) {
                //console.log(`content ${message.content}`)
                if (message.content == `${config.prefix}refreshshop`) {
                    refreshshop()
                    const refresh = new MessageEmbed()
                        .setColor('#ff00ff')
                        .setTitle(`Sklep został odświeżony manualnie`)
                        .addFields(
                            { name: "\u200B", value:`Skorzystano z komendy dla zaufanych`}
                            )
                        
                    message.channel.send(refresh)
                } else if (message.content == `${config.prefix}showlogs`) {
                    var fileloc2 = require(`./logs/logs${day}.${month + 1}.${year}/logs${day}.${month + 1}.${year}[${logid}].json`)
                    console.log(fileloc2)
                    var logfile = JSON.parse(JSON.stringify(fileloc2))
                    logtable = [""]
                    loop3 = 0;
                    if (logfile.data.length < 30) {
                        for (var i = logfile.data.length - 1; i >= 0; i--) {
                            logtable[loop3] = logfile.data[i] + "\n"
                            loop3++;
                        }
                    }
                    console.log(logtable)
                    const refresh = new MessageEmbed()
                        .setColor('#ff00ff')
                        .setTitle(`Lista ostatnich czynności bota i graczy (NR ${logid})`)
                        .setDescription(`${logtable}`)
                        .addFields(
                            { name: "\u200B", value:`Skorzystano z komendy dla zaufanych`}
                            )
                        
                    message.channel.send(refresh)
                } else if (message.content == `${config.prefix}turnoff`) {
                    if (turnoff == false) {
                        turnoff = true;
                        const turnoffmes = new MessageEmbed()
                            .setColor('#ff00ff')
                            .setTitle(`Bot przeszedł w tryb przerwy konserwacyjnej - nie przyjmie żadnych komend gracza w tej chwili`)
                            .addFields(
                                { name: "\u200B", value:`Skorzystano z komendy dla zaufanych`}
                                )
                            
                        message.channel.send(turnoffmes)
                    } else {
                        turnoff = false;
                        const turnoffmes = new MessageEmbed()
                            .setColor('#ff00ff')
                            .setTitle(`Bot przeszedł w tryb aktywny - ponownie funkcjonuje`)
                            .addFields(
                                { name: "\u200B", value:`Skorzystano z komendy dla zaufanych`}
                                )
                            
                        message.channel.send(turnoffmes)
                    }
                    
                }
            }
        })
    })
})

// \/ \/ \/ Kolejki dodania użytkownika do fazy oczekiwania na akcję \/ \/ \/

activedb1 = 0; // ID użytkownika
activedb1time = 0; // Pozostały czas sesji
activedb1ch = 0; // Wiadomość z sesji
activedb1mode = 0; // Rodzaj sesji
activedb2 = 0;
activedb2time = 0;
activedb2ch = 0;
activedb2mode = 0;
activedb3 = 0;
activedb3time = 0;
activedb3ch = 0;
activedb3mode = 0;



setInterval(logout, 1000);

function logout () {
    //console.log(activedb1 + " " + activedb1time + " " + activedb1ch + " " + activedb2 + " " + activedb2time + " " + activedb2ch +  " " + activedb3 + " " + activedb3time + " " + activedb3ch)
}

setInterval(decreaseactivedbtime, 1000);
setInterval(checkfortimeout, 1000);

function decreaseactivedbtime() {
    if (activedb1time > 0) {
        activedb1time--;
    }
    if (activedb2time > 0) {
        activedb2time--;
    }
    if (activedb3time > 0) {
        activedb3time--;
    }
}

function checkfortimeout() {
    if (activedb1time == 0 && activedb1 != 0) {
        timeoutmess(activedb1ch);
        activedb1 = 0;
        activedb1ch = 0
        activedb1mode = 0;
    }
    
    if (activedb2time == 0 && activedb2 != 0) {
        timeoutmess(activedb2ch);
        activedb2 = 0;
        activedb2ch = 0
        activedb2mode = 0;
    }
    
    if (activedb3time == 0 && activedb3 != 0) {
        timeoutmess(activedb3ch);
        activedb3 = 0;
        activedb3ch = 0
        activedb3mode = 0;
    }
}



function timeoutmess(message) {
    logg(`Anulowano sesję użytkownika ${message.author.username} (${message.author.id}) przez upływ czasu`, message)
    const timeout = new MessageEmbed()
        .setColor('#ff2222')
        .setTitle(`Twoja sesja przeminęła, ${message.author.username}!`)
        .setDescription(`Twoja ostatnio aktywna sesja została automatycznie anulowana przez upływ czasu.`)
    message.channel.send(timeout)
}

function addtobase(id, message, time, mode) {
    
    if (activedb1 != 0 && activedb2 != 0 && activedb3 != 0) {
        logg(`Nieudana próba utworzenia sesji przez użytkownika ${message.author.username} (${message.author.id}): Brak pustych sesji`, message)
        const toomuch = new MessageEmbed()
            .setColor('#ff2222')
            .setTitle(`${message.author.username}! Zaczekaj!`)
            .setDescription(`W tej chwili są aktywne więcej niż trzy sesje. Zaczekaj chwilę i spróbuj wykonać swoją komendę ponownie.`)
        message.channel.send(toomuch)
        return false;
    } else if (activedb1 != id && activedb2 != id && activedb3 != id) {
        if (activedb1 == 0) {
            activedb1 = id;
            activedb1time = time;
            activedb1ch = message
            activedb1mode = mode;
        } else if (activedb2 == 0) {
            activedb2 = id;
            activedb2time = time;
            activedb2ch = message
            activedb2mode = mode;
        } else if (activedb3 == 0) {
            activedb3 = id;
            activedb3time = time;
            activedb3ch = message
            activedb3mode = mode;
        }
        return true;
    } else {
        logg(`Nieudana próba utworzenia sesji przez użytkownika ${message.author.username} (${message.author.id}): Uzytkownik ma już aktywną sesję`, message)
        const alreadyactive = new MessageEmbed()
            .setColor('#ff2222')
            .setTitle(`Ukończ poprzednią akcję, ${message.author.username}!`)
            .setDescription(`Wygląda na to, że już masz jakąś aktywną sesję. Zaczekaj, aż sesja przeminie i spróbuj wykonać swoją komendę ponownie.`)
        message.channel.send(alreadyactive)
        return false;
    }
}



function sessionmessages1(message) {
    //console.log(activedb1ch)
    //console.log("got: " + message.channel.id + " " + activedb1ch.channel.id)
    if (message.author.id == activedb1) {
        if (activedb1ch != 0) {
            if (message.channel.id == activedb1ch.channel.id) {
                return activedb1mode
            } else {
                return 0;
            }
        }
    } else if (message.author.id == activedb2) {
        if (activedb2ch != 0) {
            if (message.channel.id == activedb2ch.channel.id) {
                return activedb2mode
            } else {
                return 0;
            }
        }
    } else if (message.author.id == activedb3) {
        if (activedb3ch != 0) {
            if (message.channel.id == activedb3ch.channel.id) {
                return activedb3mode
            } else {
                return 0;
            }
        }
    }    
}

function removefromactivedb(message) {
    if (message.author.id == activedb1) {
        activedb1 = 0;
        activedb1time = 0;
        activedb1mode = 0;
        activedb1ch = 0;
        return 1;
    } else if (message.author.id == activedb2) {
        activedb2 = 0;
        activedb2time = 0;
        activedb2mode = 0;
        activedb2ch = 0;
        return 1;
    } else if (message.author.id == activedb2) {
        activedb3 = 0;
        activedb3time = 0;
        activedb3mode = 0;
        activedb3ch = 0;
        return 1;
    }
}

// /\ /\ /\ Kolejki dodania użytkownika do fazy oczekiwania na akcję /\ /\ /\


function savestate(file) {
    logg2(`Zapis pliku DATA`)
    fs.writeFile('data.json', JSON.stringify(file), (err) => {
        if (err) {
            throw err;
        }
        //console.log(`DATA: ${data}`)
        //data.forceUpdate()
        console.log("JSON data is saved.");
    });
}

var logid = 1;
var fileloc = `./logs/logs${day}.${month + 1}.${year}/logs${day}.${month + 1}.${year}[${logid}].json`

function startlog() {
    
    //console.log(`FILE: ${JSON.stringify(file)}`)
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    logid = 0;
    if (!fs.existsSync(`./logs/logs${day}.${month + 1}.${year}/`)){
        fs.mkdirSync(`./logs/logs${day}.${month + 1}.${year}/`);
    }
    do {
        logid++;
        fileloc = `./logs/logs${day}.${month + 1}.${year}/logs${day}.${month + 1}.${year}[${logid}].json`
        console.log(`LOGID ${logid} ${fileloc}`)
    } while (fs.existsSync(fileloc))
    console.log(`LOGID ${logid} ${fileloc}`)
    setTimeout(() => {
        console.log(`STARTLOG ${fileloc}`)
        fs.copyFile('./logs/logstemplate.json', fileloc, (err) => {
            if (err) throw err;
            console.log('File was copied to destination');
        })
    }, 500);
    
}

function savestatelog(file) {
    const d = new Date();
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    //logid = 0
    /*
    if (!fs.existsSync(`./logs/logs${day}.${month + 1}.${year}/`)){
        fs.mkdirSync(`./logs/logs${day}.${month + 1}.${year}/`);
    }
    do {
        logid++;
        fileloc = `./logs/logs${day}.${month + 1}.${year}/logs${day}.${month + 1}.${year}[${logid}].json`
        console.log(`LOGID ${logid} ${fileloc}`)
    } while (fs.existsSync(fileloc))
    console.log(`LOCALIZATION ${fileloc}`)
    */
    if (fs.existsSync(fileloc)) {
        setTimeout(() => {
        console.log("exist")
            setTimeout(() => {
                fs.writeFile(fileloc, JSON.stringify(file), (err) => {
                    if (err) {
                        throw err;
                    }
                    //console.log(`DATA: ${data}`)
                    //data.forceUpdate()
                    console.log(`log to ${fileloc}`);
                });
            }, 0)
        }, 500)
        
    } else {
        console.log("dont exist")
        
            
        
            fs.copyFile('./logs/logstemplate.json', fileloc, (err) => {
                setTimeout(() => {
                if (err) throw err;
                console.log('File was copied to destination');
                fs.writeFile(fileloc, JSON.stringify(file), (err) => {
                    if (err) {
                        throw err;
                    }
                    //console.log(`DATA: ${data}`)
                    //data.forceUpdate()
                    console.log(`log to ${fileloc}`);
                });
                }, 500);
            });
        
    }
}

function unregistered(message){
    logg(`Nieudana próba wykonania komendy przez użytkownika ${message.author.username} (${message.author.id}): Użytkownik nie jest zarejestrowany w bazie`, message)
    const unregistered = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Nie jesteś zarejestrowany(a) w bazie!`)
        .setDescription(`Nie można wykonać tego polecenia, gdy twoje ID nie jest zarejestrowane w bazie. Aby się zarejestrować, użyj komendy ${config.prefix}register.`)
    message.channel.send(unregistered)
}

// ZDOBYWANIE EMOTEK \/\/\/

var rareemojidrop = 40
var epicemojidrop = 40
var gotwhatname;
var gotwhatid;
var gotwhatrar;


function getemoji(message) { // LOSOWA EMOTKA
    var whattoreturn;
    var letreturn = false;

    var rando = Math.random()
    var rando2 = Math.random()
    //console.log(rando)
    if (rando < rareemojidrop / 100) {
        if (rando2 < epicemojidrop / 100) {
            var emotegroupid = Math.ceil(Math.random() * listemotes.epicemoji.length)
    var emotename = listemotes.epicemoji[emotegroupid - 1]
    var emoteshowname = listemotes.allemotes
        //return `Not Rare Emoji (${emote})`
        var addemote = JSON.parse(JSON.stringify(data.user));
        var check = 1;
        var loop = 0
        //console.log(emoteslist)
        
        addemote.forEach(curid => {
            
            if (check == 1) {
                
                if (parseInt(curid) == message.author.id) {
                   
                    check = 0;
                    check2 = 1;
                    loop2 = 0;
                    listemotes.allemotes.forEach(cure => {
                        if (check2 = 1) {
                            //console.log(cure[0])
                            //console.log(emotename)
                            if (cure[0] == emotename) {
                                check2 = 0;
                                emoteid = listemotes.allemotes[loop2][1]
                                //console.log(`EMOTE NAME: ${emotename}`)
                                gotwhatname = emotename
                                gotwhatid = emoteid
                                gotwhatrar = 3
                                whattoreturn = `(Epicka) ${emoteshowname[loop2][2]}`
                                letreturn = true;
                            }
                        }
                        loop2++;
                    })
                }
            }
            loop++;
        })
        } else {
            var emotegroupid = Math.ceil(Math.random() * listemotes.rareemoji.length)
            var emotename = listemotes.rareemoji[emotegroupid - 1]
            var emoteshowname = listemotes.allemotes
                //return `Not Rare Emoji (${emote})`
                var addemote = JSON.parse(JSON.stringify(data.user));
                var check = 1;
                var loop = 0
                //console.log(emoteslist)
                
                addemote.forEach(curid => {
                    
                    if (check == 1) {
                        
                        if (parseInt(curid) == message.author.id) {
                        
                            check = 0;
                            check2 = 1;
                            loop2 = 0;
                            listemotes.allemotes.forEach(cure => {
                                if (check2 = 1) {
                                    //console.log(cure[0])
                                    //console.log(emotename)
                                    if (cure[0] == emotename) {
                                        check2 = 0;
                                        emoteid = listemotes.allemotes[loop2][1]
                                        //console.log(`EMOTE NAME: ${emotename}`)
                                        gotwhatname = emotename
                                        gotwhatid = emoteid
                                        gotwhatrar = 2
                                        whattoreturn = `(Rzadka) ${emoteshowname[loop2][2]}`
                                        letreturn = true;
                                    }
                                }
                                loop2++;
                            })
                        }
                    }
                    loop++;
                })
        }
    } else {
        
        var emotegroupid = Math.ceil(Math.random() * listemotes.normalemoji.length)
        var emotename = listemotes.normalemoji[emotegroupid - 1]
        var emoteshowname = listemotes.allemotes
        //return `Not Rare Emoji (${emote})`
        var addemote = JSON.parse(JSON.stringify(data.user));
        var check = 1;
        var loop = 0
        //console.log(emoteslist)
        
        addemote.forEach(curid => {
            
            if (check == 1) {
                
                if (parseInt(curid) == message.author.id) {
                   
                    check = 0;
                    check2 = 1;
                    loop2 = 0;
                    listemotes.allemotes.forEach(cure => {
                        if (check2 = 1) {
                            //console.log(cure[0])
                            //console.log(emotename)
                            if (cure[0] == emotename) {
                                check2 = 0;
                                emoteid = listemotes.allemotes[loop2][1]
                                //console.log(`EMOTE NAME: ${emotename}`)
                                gotwhatname = emotename
                                gotwhatid = emoteid
                                gotwhatrar = 1
                                whattoreturn = `(Zwykła) ${emoteshowname[loop2][2]}`
                                letreturn = true;
                            }
                        }
                        loop2++;
                    })
                }
            }
            loop++;
        })
    }
    if (letreturn == true) {
        letreturn = false
        return whattoreturn
    }
}

function getepicemoji(message) { // EPICKA EMOTKA
    var whattoreturn;
    var letreturn = false;

    var rando = Math.random()
    var rando2 = Math.random()
    //console.log(rando)
    var emotegroupid = Math.ceil(Math.random() * listemotes.epicemoji.length)
    var emotename = listemotes.epicemoji[emotegroupid - 1]
    var emoteshowname = listemotes.allemotes
        //return `Not Rare Emoji (${emote})`
        var addemote = JSON.parse(JSON.stringify(data.user));
        var check = 1;
        var loop = 0
        //console.log(emoteslist)
        
        addemote.forEach(curid => {
            
            if (check == 1) {
                
                if (parseInt(curid) == message.author.id) {
                   
                    check = 0;
                    check2 = 1;
                    loop2 = 0;
                    listemotes.allemotes.forEach(cure => {
                        if (check2 = 1) {
                            //console.log(cure[0])
                            //console.log(emotename)
                            if (cure[0] == emotename) {
                                check2 = 0;
                                emoteid = listemotes.allemotes[loop2][1]
                                //console.log(`EMOTE NAME: ${emotename}`)
                                gotwhatname = emotename
                                gotwhatid = emoteid
                                gotwhatrar = 3
                                whattoreturn = `(Epicka) ${emoteshowname[loop2][2]}`
                                letreturn = true;
                            }
                        }
                        loop2++;
                    })
                }
            }
            loop++;
        })

        if (letreturn == true) {
            letreturn = false
            return whattoreturn
        }
}

function addemotetoprofile(gotwhat, message) {
    var letreturn = false;
    var gotwhatname2 = gotwhatname
    var gotwhatid2 = gotwhatid
    //var gotwhatrar2 = gotwhatrar
    
    gotwhatid = 0;
    //gotwhatrar = 0;
    var addemote = JSON.parse(JSON.stringify(data.user));
    var check = 1;
    var loop = 0
    //console.log(emoteslist)
    
    addemote.forEach(curid => {
    
    if (check == 1) {
        if (parseInt(curid) == message.author.id) {
                   
            check = 0;
            check2 = 1;
            loop2 = 0;
            data.emotes[loop].forEach(cure => {
                    if (check2 = 1) {
                        if (loop2 == (gotwhatid2 - 1)) {
                            check2 = 0;
                            if (data.emotes[loop][loop2] == 0) {
                                data.emotes[loop][loop2] = 1
                                savestate(data);
                                whattoreturn = true
                            } else {
                                whattoreturn = false
                            }
                            letreturn = true
                        }
                    }
                    loop2++;
                })
        }
        }
        loop++;
        })

        if (letreturn == true) {
            letreturn = false
            return whattoreturn
        }
}

// ZDOBYWANIE EMOTEK /\/\/\


function notenoughmoney(message, userdata) {
    logg(`Błąd podczas kupienia przedmiotu przez ${message.author.username} (${message.author.id}): za mało emoticoinów (${userdata.money[loop]} / ${itemprice})`, message)
    const nomoney = new MessageEmbed()
        .setColor('#ee2222')
        .setTitle(`Brak Emoticoinów`)
        .setDescription(`Nie masz wystarczającej ilości Emoticoinów (<a:emoticoin:930438839829426186>) do zakupienia tego przedmiotu.`)
    message.channel.send(nomoney)
}



// SHOP

var correcthour = false;
var correctminute = false;
var blockcheckforcorrecttime = false;

setInterval(() => {

    const d = new Date();
    let minute = d.getMinutes();
    if (minute == parseInt(shopset.refreshminute)) {
        correctminute = true;
    } else {
        correctminute = false;
    }
    //console.log(`MINUTE: ${minute}/${shopset.refreshminute}`);
}, 1000);

setInterval(() => {
    const d = new Date();
    let hour = d.getHours();
    if (hour == parseInt(shopset.refreshhour)) {
        correcthour = true;
    } else {
        correcthour = false;
    }
    //console.log(`HOUR: ${hour}/${shopset.refreshhour}`);
    //console.log(`hour: ${correcthour}, minute: ${correctminute}, block: ${blockcheckforcorrecttime}`);
}, 1000);

setInterval(() => {
    if (blockcheckforcorrecttime == true) {
        blockcheckforcorrecttime = false
    }
}, 10000);

setInterval(() => {
    if (correcthour == true && correctminute == true && blockcheckforcorrecttime == false) {
        refreshshop()
        console.log("Shop refresh")
        correctminute = false;
        correcthour = false;
        blockcheckforcorrecttime = true;
    }
}, 40000);


var emote1, emote2, emote3, emote4, emote1rar, emote2rar, emote3rar, emote4rar, emote1rarname, emote2rarname, emote3rarname, emote4rarname, emote1price, emote2price, emote3price, emote4price;
var special1, special1price, special1name;
var test = 2;
inshop = []
var randitem;

function repeat(func, times) {
    func();
    times && --times && repeat(func, times);
}

repeat(function () {console.log("test")}, 10)

function refreshshop() {
    emote1 = randomIntFromInterval(1, listemotes.allemotes.length)
    emote1rar = listemotes.allemotes[emote1 - 1][3]
    if (emote1rar == 1) {
        emote1rarname = "Zwykła"
        emote1price = emotesdup.refund[1]

    } else if (emote1rar == 2) {
        emote1rarname = "Rzadka"
        emote1price = emotesdup.refund[3]
    } else {
        emote1rarname = "Epicka"
        emote1price = emotesdup.refund[5]
    }

    emote2 = randomIntFromInterval(1, listemotes.allemotes.length)
    emote2rar = listemotes.allemotes[emote2 - 1][3]
    if (emote2rar == 1) {
        emote2rarname = "Zwykła"
        emote2price = emotesdup.refund[1]
    } else if (emote2rar == 2) {
        emote2rarname = "Rzadka"
        emote2price = emotesdup.refund[3]
    } else {
        emote2rarname = "Epicka"
        emote2price = emotesdup.refund[5]
    }

    emote3 = randomIntFromInterval(1, listemotes.allemotes.length)
    emote3rar = listemotes.allemotes[emote3 - 1][3]
    if (emote3rar == 1) {
        emote3rarname = "Zwykła"
        emote3price = emotesdup.refund[1]
    } else if (emote3rar == 2) {
        emote3rarname = "Rzadka"
        emote3price = emotesdup.refund[3]
    } else {
        emote3rarname = "Epicka"
        emote3price = emotesdup.refund[5]
    }

    emote4 = randomIntFromInterval(1, listemotes.allemotes.length)
    emote4rar = listemotes.allemotes[emote4 - 1][3]
    if (emote4rar == 1) {
        emote4rarname = "Zwykła"
        emote4price = emotesdup.refund[1]
    } else if (emote4rar == 2) {
        emote4rarname = "Rzadka"
        emote4price = emotesdup.refund[3]
    } else {
        emote4rarname = "Epicka"
        emote4price = emotesdup.refund[5]
    }

    var randomspecial = randomIntFromInterval(1, shopitems.stuff.length)
    loop = 0
    randomspecial--;
    special1 = randomspecial
    if (1) {
        special1name = shopitems.stuff[randomspecial][2]
        special1price = shopitems.stuff[randomspecial][1]
        //console.log(`INSHOP THERE IS ${special1}`)
    }

    console.log(`${emote1} ${emote1rarname} ${emote2} ${emote2rarname} ${emote3} ${emote3rarname} ${emote4} ${emote4rarname}`)
    console.log(`${special1} ${special1name} ${special1price}`)
    console.log(shopitems.stuff[special1][1])
    logg2(`ODŚWIEŻENIE SKLEPU`)
    refreshfreeaward()
    /*
    var loop = 0
    inshop = []
    repeat(function () {
        console.log("refresher")
        randitem = randomIntFromInterval(1, listemotes.allemotes.length)
        console.log(`> Wylosowano ${randitem}`)
        if (inshop.length == 0) {
            
            inshop[0] = randitem
            console.log(`Pierwszy element ${inshop}`) 
        } else {
            var loop2 = 0
            var randitem2 = randitem
            console.log(`w randitemie2 jest ${randitem2}`)
            inshop.forEach(item => {
                var randitem2 = randitem
                console.log(`Pętla inshopu ${item} porównująca ${randitem2}`)
                if (item == randitem2) {
                    var randitem3 = randitem2
                    console.log(`Dany element w inshopie pasuje do randitemu`)
                    while (item == randitem3) {
                        //var randitem4 = randitem3
                        var randitem3 = randomIntFromInterval(1, listemotes.allemotes.length)
                        console.log(`Próba wylosowania innej liczby: ${randitem3}`)
                        inshop[loop2] += randitem3
                        console.log(`while progress ${inshop}`)
                    }
                    
                    
                } else {
                    
                }
                if (loop == 3) {
                    console.log(`MINILOOP ${randitem2}`)
                    inshop[loop] += randitem2
                }
                })
            loop2++;
        }
        loop++;
    }, 4);
    console.log(inshop)
    */
}

function shopdup(message, itemid) {
    var addemote = JSON.parse(JSON.stringify(data.user));
    var check = 1;
    var loop = 0
    //console.log(emoteslist)
    
    addemote.forEach(curid => {
    
    if (check == 1) {
        if (parseInt(curid) == message.author.id) {
                   
            check = 0;
            check2 = 1;
            loop2 = 0;
            data.emotes[loop].forEach(cure => {
                    if (check2 == 1) {
                        if (loop2 == itemid) {
                            if (cure == 0) {
                                whattoreturn = true
                            } else {
                                whattoreturn = false
                            }
                            letreturn = true
                        }
                        
                    }
                    loop2++;
                })
        }
        }
        loop++;
        })

        if (letreturn == true) {
            letreturn = false
            return whattoreturn
        }
}

function cantbuydup(message, itemid) {
    logg(`Błąd podczas kupienia emotki ${listemotes.allemotes[itemid][2]} przez ${message.author.username} (${message.author.id}): Nie można zakupić duplikatu`, message)
    const cantbuydupmes = new MessageEmbed()
        .setColor('#ee2222')
        .setTitle(`Nie można kupić duplikatu!`)
        .setDescription(`Niestety, ale nie możesz zakupić tej emotki, ponieważ już ją masz. Duplikaty możesz zdobyć tylko poprzez pakiety i losowe emotki.`)
    message.channel.send(cantbuydupmes)
}

function refreshshop2() {
    loop = 0
    var fail = false;



    /*
    for (const element of inshop) {
        if (inshop[loop] != inshop.length - 1) {
            if (inshop[loop] == inshop[loop + 1]) {
                inshop[loop + 1] = parseInt(randomIntFromInterval(1, listemotes.allemotes.length))
                fail = true;
            }
        } else {

        }
        if (loop == inshop.length - 1) {
            console.log(inshop)
            if (fail == true) {
                setTimeout(refreshshop2(), 1000); 
                break;
            }
        }
        loop++;
    }
    */


    
    /*
    for (const item of inshop) {
        console.log(`loop: ${item}, check: ${check}`)
        if (check == 1) {
            if (item != randitem && item > 0) {
                check = 0
                emote2 = randitem
                inshop += emote2
                console.log(`second added ${inshop}`)
                break;
            } else {
                var randitem = randomIntFromInterval(1, listemotes.allemotes.length)
                break;
            }
        }
    }
    */
    
    //console.log(`${emote1} ${emote2} ${emote3} ${emote4}`)

    //var randitem = randomIntFromInterval(1, listemotes.allemotes.length)
}

var dupinchatsign = "[D] "

function dupinshop(message,dupemote, loop) {
    
    if (data.emotes[loop][emote1 - 1] == 1) {
        dupemote[0] = dupinchatsign
    }
    if (data.emotes[loop][emote2 - 1] == 1) {
        dupemote[1] = dupinchatsign
    }
    if (data.emotes[loop][emote3 - 1] == 1) {
        dupemote[2] = dupinchatsign
    }
    if (data.emotes[loop][emote4 - 1] == 1) {
        dupemote[3] = dupinchatsign
    }
    return dupemote
}


function refreshfreeaward() {
    loop = 0;
    data.freeaward.forEach(cur => {
        data.freeaward[loop] = 1;
        loop++;
    })
    savestate(data)
}

function freeawardrandom(message, loop) {
    var randomaward = randomIntFromInterval(1, 2)
    if (randomaward == 1) { // EMOTICOINS
        var coinaward = randomIntFromInterval(50, 150)
        data.money[loop] += coinaward
        savestate(data)
        return `${coinaward} Emoticoinów! <a:emoticoin:930438839829426186>`
    } else if (randomaward == 2) {
        data.inv[loop][0] += 1
        savestate(data)
        return `przedmiot: Losowa Emotka! <:happypin:930475315086622720>`
    }
    
}



function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  

client.login(process.env.TOKEN)