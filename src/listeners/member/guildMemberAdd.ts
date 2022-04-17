import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { GuildMember } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'

const usersMap = new Map();

export default new Listener(
	'guildMemberAdd',
	async (client: Mono, member: GuildMember) => {
		// Autorole
		const guildAutoroleModule = (member.guild as MonoGuild).modules.roles
		if(guildAutoroleModule.enabled && guildAutoroleModule.roleId && !member.pending) {
			const autorole = await member.guild.roles.fetch(guildAutoroleModule.roleId)
			await member.roles.add(guildAutoroleModule.roleId).catch(() => {})
		}
	}
)
