import Listener from '@base/Listener'
import Mono from '@base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import Console from '@utils/console'
import { boticordIntegration, sdcIntegration } from '../../integrations'

export default new Listener('ready', async (client: Mono) => {
	Console.success(
		`Ready! Logged in as '${client.user!.username}#${client.user!.discriminator}' in ${
			client.guilds.cache.size
		} guilds.`
	)

	// Run integrations#
	if (process.env.mode === 'production') {
		boticordIntegration(client)
		sdcIntegration(client)
	}

	client.guilds.cache.forEach((guild) => {
		(guild as MonoGuild).fetchCustomData()
	})

	client.user?.setStatus('online')
})
