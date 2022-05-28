import MonoGuild from '@base/discord.js/Guild'
import { MonoEmbed } from '@base/Embed'
import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { TextChannel } from 'discord.js'

export default new Listener(
	'guildDelete',
	async (client: Mono, guild: MonoGuild) => {
		await ((await client.channels.fetch(process.env.MONO_LOGS_CHANNEL!)) as TextChannel).send({
			embeds: [
				new MonoEmbed()
					.setTitle('Guild removed')
					.addField('Name', guild.name, true)
					.addField('Owner', (await client.users.fetch(guild.ownerId)).tag, true)
					.addField('Members', guild.memberCount.toString(), true)
					.addField('Id', '`' + guild.id + '`')
					.setColor('#F04747')
			]
		})
	}
)
