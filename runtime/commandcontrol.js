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

var json = '{';
var filename = commandLoc + `commands.json`;
var current = 0;

for (var d in com) {
  current++;
  if (com[d].Filename == null) continue;

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
  }
  json += JSON.stringify(exp) + ',';
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
    ]
    msg.author.openDM().then((y) => {
      if (!msg.isPrivate) {
        msg.channel.sendMessage('Help is underway ' + msg.author.mention + '!')
      }
      var field = [
        { name: 'From Server', value: `${msg.guild.name}`, inline: true },
        // { name: 'Owned by', value: '```\n' + `${msg.guild.owner.username}#${msg.guild.owner.discriminator} (${msg.guild.owner.id})` + '```', inline: true },
        // { name: 'Current Region', value: '```\n' + msg.guild.region + '```', inline: true },
        // { name: 'Members', value: '```\n' + msg.guild.members.length + '```', inline: true },
        // { name: 'Text Channels', value: '```\n' + msg.guild.textChannels.length + '```', inline: true },
        // { name: 'Voice Channels', value: '```\n' + msg.guild.voiceChannels.length + '```', inline: true },
        // { name: 'Total Roles', value: '```\n' + msg.guild.roles.length + '```', inline: true },
        { name: 'Bot Uptime', value: getUptime(), inline: true }
      ]
      var embed = {
        title: `Documentation`,
        description: `**Help is underway**\nWe made a documentation site, that you can visit [here](https://eagle-docs.firebaseapp.com/)`,
        url: `https://eagle-docs.firebaseapp.com/`,
        color: 0x2196f3,
        timestamp: new Date(),
        fields: field,
        footer: {
          icon_url: `https://i.imgur.com/ToSRyGj.png`,
          text: `made by DaKapo`
        },
        author: {
          name: `Eaglebot`,
          url: `https://discord.gg/Gn6DbZ7`,
          icon_url: "https://i.imgur.com/8hVi4fn.png"
        }
      }
      if (msg.guild.icon) { embed.thumbnail = { url: msg.guild.iconURL } }
      y.sendMessage('', false, embed)
      y.sendMessage(misc.join('\n'))
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

