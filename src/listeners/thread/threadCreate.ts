import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { ThreadChannel } from 'discord.js'

export default new Listener(
	'threadCreate',
	async (client: Mono, thread: ThreadChannel) => {
		await thread.join()
	}
)