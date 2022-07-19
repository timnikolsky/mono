import Listener from '@base/Listener'
import Mono from '@base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import Console from '@utils/console'

export default new Listener(
	'ready',
	async (client: Mono) => {
		Console.success(`Ready! Logged in as '${client.user!.username}#${client.user!.discriminator}' in ${client.guilds.cache.size} guilds.`)

		client.guilds.cache.forEach(async (guild) => {
			await (guild as MonoGuild).fetchCustomData()
			await (guild as MonoGuild).uploadCommands()
		})
	}
)
