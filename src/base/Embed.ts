import { MessageEmbed, MessageEmbedOptions } from 'discord.js'
import emojis from '../assets/emojis'

export class Embed extends MessageEmbed {
	constructor(data?: MessageEmbed | MessageEmbedOptions) {
		if(!data) data = { color: '#2F3136' }
		if(!data.color) data.color = '#2F3136'
		super(data)
	}
}

export class EmojiEmbed extends Embed {
	constructor(emoji: string, content: string) {
		super({
			description: `${emoji} ${content}`
		})
	}
}

export class SuccessEmbed extends EmojiEmbed {
	constructor(content: string) {
		super(emojis.success, content)
	}
}

export class ErrorEmbed extends EmojiEmbed {
	constructor(content: string) {
		super(emojis.error, content)
	}
}

export class InfoEmbed extends EmojiEmbed {
	constructor(content: string) {
		super(emojis.info, content)
	}
}
