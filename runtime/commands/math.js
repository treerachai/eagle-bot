var Commands = []
var request = require('superagent')
var config = require('../../config.json')
var Logger = require('../internal/logger.js').Logger
var argv = require('minimist')(process.argv.slice(2))
var bugsnag = require('bugsnag')

Commands.add = {
    name: 'add',
    help: "I'll add numbers!",
    aliases: ['sum, plus'],
    usage: '<number1> <number2>',
    timeout: 0,
    noDM: false,
    level: 0,
    fn: function (msg, suffix) {
        let s = suffix.split(' ')
        if (s.length != 2) {
            msg.reply('Enter only 2 Numbers')
            return
        }

        s.forEach(function (element) {
            if (typeof element != 'number' && (element % 1) != 0) {
                msg.reply('At least one of your entries was not a number')
                return
            }
        });
        msg.reply('The result is ' + (s[0] + s[1]))
    }
}

Commands.subtract = {
    name: 'subtract',
    help: "I'll subtract numbers!",
    aliases: ['minus'],
    usage: '<number1> <number2>',
    timeout: 0,
    noDM: false,
    level: 0,
    fn: function (msg, suffix) {
        let s = suffix.split(' ')
        if (s.length != 2) {
            msg.reply('Enter only 2 Numbers')
            return
        }

        s.forEach(function (element) {
            if (typeof element != 'number' && (element % 1) != 0) {
                msg.reply('At least one of your entries was not a number')
                return
            }
        });
        msg.reply('The result is ' + (s[0] - s[1]))
    }
}

Commands.multiply = {
    name: 'multiply',
    help: "I'll multiply numbers!",
    aliases: ['times'],
    usage: '<number1> <number2>',
    timeout: 0,
    noDM: false,
    level: 0,
    fn: function (msg, suffix) {
        let s = suffix.split(' ')
        if (s.length != 2) {
            msg.reply('Enter only 2 Numbers')
            return
        }

        s.forEach(function (element) {
            if (typeof element != 'number' && (element % 1) != 0) {
                msg.reply('At least one of your entries was not a number')
                return
            }
        });
        msg.reply('The result is ' + (s[0] * s[1]))
    }
}

Commands.divide = {
    name: 'divide',
    help: "I'll divide numbers!",
    usage: '<number1> <number2>',
    timeout: 0,
    noDM: false,
    level: 0,
    fn: function (msg, suffix) {
        let s = suffix.split(' ')
        if (s.length != 2) {
            msg.reply('Enter only 2 Numbers')
            return
        }

        s.forEach(function (element) {
            if (typeof element != 'number' && (element % 1) != 0) {
                msg.reply('At least one of your entries was not a number')
                return
            }
        });
        msg.reply('The result is ' + (s[0] / s[1]))
    }
}


exports.Commands = Commands
exports.Filename = "Math"


