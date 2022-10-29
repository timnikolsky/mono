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

	// Run integrations
	if (process.env.mode === 'production') {
		boticordIntegration(client)
		sdcIntegration(client)
	}

	client.guilds.cache.forEach(async (guild) => {
		await (guild as MonoGuild).fetchCustomData()
		try {
			await (guild as MonoGuild).uploadCommands()
		} catch (e) {
			console.log(e)
		}

		if((guild as MonoGuild).modules.dayNight.enabled) {
			if((guild as MonoGuild).modules.dayNight.daytimeGuildIconUrl) {
				const channelNames = (guild as MonoGuild).modules.dayNight.channelNames
				const daytime = (guild as MonoGuild).modules.dayNight.daytime
				const nighttime = (guild as MonoGuild).modules.dayNight.nighttime
			}
		}
	})

	client.user?.setStatus('online')
})
