import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { Message } from 'discord.js'

const usersMap = new Map();

export default new Listener(
	'messageCreate',
	async (client: Mono, message: Message) => {

	}
)
