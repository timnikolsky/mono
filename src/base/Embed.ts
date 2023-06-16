import { EmbedBuilder, EmbedData } from 'discord.js'
import emojis from '../assets/emojis'

export class MonoEmbed extends EmbedBuilder {
	constructor(data?: EmbedData) {
		if(!data) data = { color: 0x2B2D31 }
		if(!data.color) data.color = 0x2B2D31
		super(data)
	}

	addField(name: string, value: string, inline?: boolean): this {
		this.addFields([{
			name, value, inline
		}])
		return this
	}
}

export class EmojiEmbed extends MonoEmbed {
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
