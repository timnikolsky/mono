// Add path aliases
// For example, '../../../base/Mono' will become '@base/Mono'
import { addAliases } from 'module-alias'
addAliases({
	'@commands': __dirname + '/commands',
	'@listeners': __dirname + '/listeners',
	'@utils': __dirname + '/utils',
	'@base': __dirname + '/base',
	'@modules': __dirname + '/modules'
})

import MonoGuild from '@base/discord.js/Guild'
import MonoGuildMember from '@base/discord.js/GuildMember'
import MonoUser from '@base/discord.js/User'
import { IntentsBitField, Partials } from 'discord.js'
import { config } from 'dotenv'
import Mono from './base/Mono'
import chalk from 'chalk'

config()

const client = new Mono({
	partials: [
		Partials.Message, 
		Partials.Channel, 
		Partials.Reaction, 
		Partials.GuildMember,
		Partials.User
	],
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildVoiceStates
	],
	/*
		Structures were removed in Discord.js v13, but we use fork which return them.
		See README.md to see why.
		Big thanks to @YstNeris <3
	*/
	structures: {
		Guild: () => MonoGuild,
		GuildMember: () => MonoGuildMember,
		User: () => MonoUser
	}
})

client.launch()

// console.log(chalk.hex('#5865F2')(`╭───────────────────────────────────╮
// │                                   │
// │     ${chalk.bold('Mono')} ${chalk.gray('@ v1.0.2')}                 │
// │     ${chalk.hex('#B2B8FC')('• Enviroment:')} ${chalk.hex('#C9D0D9')('development')}     │
// │     ${chalk.hex('#B2B8FC')('• REST API port:')} ${chalk.hex('#C9D0D9')('2723')}         │
// │                                   │
// ╰───────────────────────────────────╯`))

// Disconnect when process ends
process.on('SIGINT', () => {
	client.database.$disconnect()
	client.destroy()
})
