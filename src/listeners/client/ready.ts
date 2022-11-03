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

	await client.application?.commands.set([{
		name: 'info',
		type: 2
	}])

	// Run integrations
	if (process.env.mode === 'production') {
		boticordIntegration(client)
		sdcIntegration(client)
	}

	client.guilds.cache.forEach((guild) => {
		(guild as MonoGuild).fetchCustomData()

		if((guild as MonoGuild).modules.dayNight.enabled) {
			(guild as MonoGuild).modules.dayNight.startTimeout()
		}
	})

	client.user?.setStatus('online')
})
