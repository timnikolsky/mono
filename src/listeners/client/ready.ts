import Listener from '@base/Listener'
import Mono from '@base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import Console from '@utils/console'

export default new Listener(
	'ready',
	async (client: Mono) => {
		// console.log(chalk.hex('#5865F2')('╭──────────╮\n│  Ready!  │\n╰──────────╯'))
		Console.success(`Ready! Logged in as '${client.user!.username}#${client.user!.discriminator}' in ${client.guilds.cache.size} guilds.`)

		client.guilds.cache.forEach((guild) => {
			(guild as MonoGuild).fetchCustomData().then(() => {
				try {
					(guild as MonoGuild).uploadCommands()
				} catch(e) {
					Console.error(`'Couldn't upload slash commands to guild '${guild.name}'`)
				}
			})
		})
	}
)
