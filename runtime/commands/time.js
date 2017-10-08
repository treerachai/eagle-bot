var Commands = []
var request = require('superagent')
var config = require('../../config.json')
var Logger = require('../internal/logger.js').Logger
var argv = require('minimist')(process.argv.slice(2))
var bugsnag = require('bugsnag')

Commands.year = {
    name: 'year',
    help: "Displays the remaining time until next year, in days, hours, minutes and seconds.",
    // aliases: ['sum, plus'],
    // usage: '<number1> <number2>',
    timeout: 0,
    noDM: false,
    level: 0,
    fn: function (msg) {
        let timeleft = []

        var startDate = new Date();
        // Do your operations
        var endDate = new Date(startDate.getFullYear(), 1, 1, 0, 0, 0, 0);
        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

        let minutes = seconds % 60
        let hours = minutes % 60
        let days = hours % 24

        hours = hours - days * 24
        minutes = minutes - hours * 60
        seconds = seconds - minutes * 60

        msg.reply('Time left to ' + endDate.getFullYear() + ' ' + days + 'Days ' + hours + ' Hours ' + minutes + ' Minutes ' + seconds + ' Seconds')
    }
}


exports.Commands = Commands
exports.Filename = "Time"