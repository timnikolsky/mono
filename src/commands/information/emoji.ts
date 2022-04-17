import { Command } from '@base/Command'
import { Embed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { Emoji } from 'discord.js'
import emojis from '../../assets/emojis'
import { formatTimestamp } from '@utils/formatters'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'emoji',
			options: [{
				id: 'emoji',
				type: CommandOptionTypes.EMOJI,
				required: true
			}]
		})
	}

	async execute({ interaction, t }: CommandContext, { emoji }: CommandOptions) {
		// If emoji is custom
		if(emoji.id) {
			await interaction.reply({
				embeds: [
					new Embed()
						.setTitle(`:${emoji.name}:`)
						.setThumbnail(emoji.url!)
						.addField(
							t('image'),
							`[${emoji.animated ? 'gif' : 'png'}](${emoji.url})`,
							true
						)
						.addField(
							t('created'),
							formatTimestamp(emoji.createdTimestamp!),
							true
						)
						.addField(
							t('common:id'),
							`\`${emoji.id}\``
						)
				]
			})
		}
		// If emoji is default
		else {
			await interaction.reply({
				embeds: [
					new Embed()
						.setTitle(emoji.name!)
						.setDescription(t('description', { link: `https://emojipedia.org/${emoji.name}` }))
				]
			})
		}
	}
}

interface CommandOptions {
	emoji: Emoji
}
