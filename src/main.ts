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
	// Structures were removed in Discord.js v13, but I use fork which return them. See README.md to see why.
	structures: {
		Guild: () => MonoGuild,
		GuildMember: () => MonoGuildMember,
		User: () => MonoUser
	},
	presence: {
		status: 'idle',
	}
})

client.launch()

// Disconnect when process ends
process.on('SIGINT', () => {
	client.database.$disconnect()
	client.destroy()
})
