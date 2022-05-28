import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import MonoGuild from '@base/discord.js/Guild'
import { MonoEmbed } from '@base/Embed'
import { MonoCommand } from '@typings/index'
import { formatTimestamp } from '@utils/formatters'
import { Emoji } from 'discord.js'
import { CommandOptionTypes } from '../../enums'

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
					new MonoEmbed()
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
					new MonoEmbed()
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
