import Mono from '@base/Mono'
import Console from '@utils/console'
import axios from 'axios'

export default async function (client: Mono) {
	// Post statistics to SDC every 30 minutes
    await postStats(client)
	setInterval(async () => postStats(client), 30 * 60 * 1000)
}

async function postStats(client: Mono) {
	const result = await axios.post(
		`https://api.server-discord.com/v2/bots/832944817671634944/stats`,
		{
			servers: client.guilds.cache.size,
		},
		{
			headers: {
				Authorization: `SDC ${process.env.SDC_TOKEN}`,
			},
		}
	)

	if (result.status === 200) {
		Console.success(`Posted statistics to SDC`)
	} else {
		Console.error(`Failed to post statistics to SDC`)
	}
}
