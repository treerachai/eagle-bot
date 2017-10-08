// hosted on https://ide.c9.io/jonasdero/eagle-bot
'use strict'
var directory = require('require-directory')
var bugsnag = require('bugsnag')
var config = require('../config.json')
bugsnag.register(config.api_keys.bugsnag)
var com = directory(module, './commands', {
  exclude: /custom/
})
var cus = directory(module, './commands/custom')
var fs = require('fs');
var Logger = require('./internal/logger.js').Logger
var commands = []
var alias = []
var commandLoc = './docs/commands/';

function getUptime() {
  var d = Math.floor(process.uptime() / 86400)
  var hrs = Math.floor((process.uptime() % 86400) / 3600)
  var min = Math.floor(((process.uptime() % 86400) % 3600) / 60)
  var sec = Math.floor(((process.uptime() % 86400) % 3600) % 60)

  if (d === 0 && hrs !== 0) {
    return `${hrs} hrs, ${min} mins, ${sec} seconds`
  } else if (d === 0 && hrs === 0 && min !== 0) {
    return `${min} mins, ${sec} seconds`
  } else if (d === 0 && hrs === 0 && min === 0) {
    return `${sec} seconds`
  } else {
    return `${d} days, ${hrs} hrs, ${min} mins, ${sec} seconds`
  }
}

for (var d in com) {
  for (var o in com[d].Commands) {
    commands[o] = com[d].Commands[o]
    if (com[d].Commands[o].aliases !== undefined) {
      for (var u in com[d].Commands[o].aliases) {
        if (alias[com[d].Commands[o].aliases[u]] && typeof alias[com[d].Commands[o].aliases[u]] !== 'function') {
          throw new Error('Aliases cannot be shared between commands!')
        }
        alias[com[d].Commands[o].aliases[u]] = com[d].Commands[o]
      }
    }
  }
}

var fieldsArr = []
var titles = []
for (let i = 0; i < 1; i++) {
  var json = '{';
  var filename = commandLoc + `commands.json`;
  var current = 0;

  for (var d in com) {
    current++;
    if (com[d].Filename == null) continue;
    var fields = []
    titles.push(com[d].Filename)
    json += '"' + com[d].Filename + '":'
    var exp = {
      name: com[d].Filename,
      commands: []
    }
    for (var cc in com[d].Commands) {
      if (cc == null) continue;
      var c = (commands[cc]) ? commands[cc] : alias[cc]
      var attributes = []
      var name
      for (var x in commands) if (commands[x] === c) {
        name = x
        break
      }

      var botNoDm = false, botHidden = false, botNsfw = false, botTimeout = 0, attr = []
      for (var attribute in c) switch (attribute) {
        case 'noDM': { botNoDm = c[attribute]; break }
        case 'hidden': { botHidden = c[attribute]; break }
        case 'nsfw': { botNsfw = c[attribute]; break }
        case 'timeout': { botTimeout = c.timeout; break }
      }
      exp.commands.push({
        name: name,
        help: c.help,
        usage: (c.usage) ? config.settings.prefix + c.name + ' ' + c.usage : config.settings.prefix + c.name,
        level: c.level,
        aliases: (c.aliases) ? c.aliases.join(', ') : '',
        attributes: {
          noDM: botNoDm,
          hidden: botHidden,
          nsfw: botNsfw,
          timeout: botTimeout,
        }
      });
      fields.push({ name: config.settings.prefix + c.name, value: c.help, inline: false })
    }
    json += JSON.stringify(exp) + ',';
    fieldsArr.push(fields)
  }
  json += '"Customize":'
  var arr = []

  let cust = {
    name: 'Customize',
    commands: [],
  }
  cust.commands.push({
    name: 'customize nsfw',
    help: 'Changes my reply when someones uses a NSFW command while I disallow that.',
    usage: config.settings.prefix + name + ' <on/off>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize permissions',
    help: 'Changes my reply when someone tries to use a command they do not have access to',
    usage: config.settings.prefix + name + ' <message>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize welcome',
    help: 'Changes my welcoming message.',
    usage: config.settings.prefix + name + ' <message>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize welcoming',
    help: 'Changes wether I should welcome new people.',
    usage: config.settings.prefix + name + ' <on/off>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize timeout',
    help: 'Changes my reply when someones uses a command that is still in cooldown',
    usage: config.settings.prefix + name + ' <number>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize prefix',
    help: 'Changes the prefix I listen to on this server, mentions will still count as a global prefix',
    usage: config.settings.prefix + name + ' <prefix>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize volume',
    help: 'Changes the default volume the bot will assume when joining a voice channel.',
    usage: config.settings.prefix + name + ' <[0-100]',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize nsfw',
    help: '',
    usage: config.settings.prefix + name + ' <on/off>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  cust.commands.push({
    name: 'customize replay',
    help: 'Changes wether I replay the playlist or not',
    usage: config.settings.prefix + name + ' <on/off>',
    level: 3,
    aliases: '',
    attributes: {
      noDM: true,
      hidden: false,
      nsfw: false,
      timeout: 0,
    }
  })
  json += JSON.stringify(cust);
  json += '}'
  fs.writeFile(filename, json, 'utf8');
  console.log('created ' + filename)
}

if (cus !== null) {
  for (var g in cus) {
    for (var l in cus[g].Commands) {
      if (commands[l] && !cus[g].Commands[l].overwrite && typeof commands[l] !== 'function') {
        throw new Error('Custom commands cannot replace default commands without overwrite enabled!')
      }
      commands[l] = cus[g].Commands[l]
      if (cus[g].Commands[l].aliases !== undefined) {
        for (var e in cus[g].Commands[l].aliases) {
          if (alias[cus[g].Commands[l].aliases[e]] && typeof alias[cus[g].Commands[l].aliases[e]] !== 'function') {
            throw new Error('Aliases cannot be shared between commands!')
          }
          alias[cus[g].Commands[l].aliases[e]] = cus[g].Commands[l]
        }
      }
    }
  }
}

exports.helpHandle = function (msg, suffix) {
  if (!suffix) {
    var misc = [
      'For further questions, join our server: https://discord.gg/Gn6DbZ7',
      'We made a documentation site, that you can visit [here](https://eagle-docs.firebaseapp.com/)',
      `From Server ${msg.guild.name}`,
      `Bot Uptime: ` + getUptime(),
    ]
    msg.author.openDM().then((y) => {
      if (!msg.isPrivate) {
        msg.channel.sendMessage('Help is underway ' + msg.author.mention + '!')
      }
      for (let i = 0; i < fieldsArr.length; i++) {
        var embed = {
          title: titles[i] + ' Commands',
          description: `**Help arrived**\n`,
          url: `https://eagle-docs.firebaseapp.com/`,
          color: 0x2196f3,
          timestamp: new Date(),
          fields: fieldsArr[i],
          footer: {
            icon_url: `https://i.imgur.com/ToSRyGj.png`,
            text: `made by DaKapo`
          },
          author: {
            name: `Eaglebot`,
            url: `https://discordapp.com/oauth2/authorize?&client_id=364341755216134144&scope=bot&permissions=536345655`,
            icon_url: "https://i.imgur.com/8hVi4fn.png"
          }
        }
        if (msg.guild.icon) { embed.thumbnail = { url: msg.guild.iconURL } }
        y.sendMessage('', false, embed)
      }
      let embed2 = {
        title: 'Additional Info',
        description: `misc.join('\n')`,
        url: `https://eagle-docs.firebaseapp.com/`,
        color: 0x2196f3,
        timestamp: new Date(),
        fields: fieldsArr[i],
        author: {
          name: `Eaglebot`,
          url: `https://discordapp.com/oauth2/authorize?&client_id=364341755216134144&scope=bot&permissions=536345655`,
          icon_url: "https://i.imgur.com/8hVi4fn.png"
        }
      }
      y.sendMessage('', false, embed2)
    }).catch((e) => {
      Logger.error(e)
      msg.channel.sendMessage('Well, this is awkward, something went wrong while trying to PM you. Do you have them enabled on this server?')
    })
  } else if (suffix) {
    if (commands[suffix] || alias[suffix]) {
      var c = (commands[suffix]) ? commands[suffix] : alias[suffix]
      var attributes = []
      var name
      for (var x in commands) {
        if (commands[x] === c) {
          name = x
          break
        }
      }
      var def = [
        `Command name: \`${name}\``,
        `What this does: \`${c.help}\``,
        'Example:',
        '```',
        `${(c.usage) ? config.settings.prefix + name + ' ' + c.usage : config.settings.prefix + name}`,
        '```',
        `**Required access level**: ${c.level}`,
        `${(c.aliases) ? '**Aliases for this command**: ' + c.aliases.join(', ') + '\n' : ''}`
      ]
      for (var attribute in c) {
        switch (attribute) {
          case 'noDM': {
            if (c[attribute] === true) attributes.push('*This command cannot be used in DMs.*')
            break
          }
          case 'hidden': {
            if (c[attribute] === true) attributes.push('*This is a hidden command.*')
            break
          }
          case 'nsfw': {
            if (c[attribute] === true) attributes.push('*This command is NSFW*')
            break
          }
          case 'timeout': {
            attributes.push(`*This command has a timeout of ${c.timeout} seconds*`)
            break
          }
        }
      }
      if (name === 'meme') {
        var str = '\n**Currently available memes:\n**'
        var meme = require('./commands/memes.json')
        for (var m in meme) {
          str += m + ', '
        }
        attributes.push(str)
      }
      msg.author.openDM().then((y) => {
        y.sendMessage(def.join('\n') + attributes.join('\n'))
      })
    } else {
      msg.channel.sendMessage(`There is no **${suffix}** command!`)
    }
  }
}

exports.Commands = commands
exports.Aliases = alias

