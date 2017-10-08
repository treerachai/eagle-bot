#!/bin/bash
exec git pull
exec rethinkdb --daemon
exec forever -o eagle-out.log -e eagle-error.log start bot.js
