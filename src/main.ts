// Add path aliases
// For example, '../../../base/Mono' will become '@base/Mono'
import { addAliases } from 'module-alias'
addAliases({
	'@commands': __dirname + '/commands',
	'@listeners': __dirname + '/listeners',
	'@utils': __dirname + '/utils',
	'@base': __dirname + '/base',
	'@modules': __dirname + '/modules',
	// '@typings': __dirname + '/typings'
})

import { Intents } from 'discord.js'
import Mono from './base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import MonoGuildMember from '@base/discord.js/GuildMember'
import MonoUser from '@base/discord.js/User'
import chalk from 'chalk'
import { config } from 'dotenv'
config()

const client = new Mono({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	// Structures were removed in Discord.js v13, but we use fork which return them. See README.md to see why.
	structures: {
		Guild: () => MonoGuild,
		GuildMember: () => MonoGuildMember,
		User: () => MonoUser
	}
})

client.launch()

// Disconnect when process ends
process.on('SIGINT', () => {
	client.database.$disconnect()
	client.destroy()
})
