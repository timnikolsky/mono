import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import MonoGuild from '@base/discord.js/Guild'
import { MonoEmbed } from '@base/Embed'
import { MonoCommand } from '@typings/index'
import { TextChannel } from 'discord.js'
import { CommandCategory, CommandOptionTypes } from '../../enums'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'slowmode',
			options: [{
				id: 'duration',
				type: CommandOptionTypes.DURATION,
				required: true,
				minValue: 0,
				maxValue: 21600
			}],
			botPermissionsRequired: ['ManageChannels'],
			userPermissionsRequired: ['ManageChannels'],
			module: 'moderation',
			category: CommandCategory.MODERATION
		})
	}

	async execute({ interaction, t }: CommandContext, { duration }: CommandOptions) {
		await (interaction.channel as TextChannel).setRateLimitPerUser(duration)
		await interaction.reply({
			embeds: [
				new MonoEmbed()
					.setDescription(
						duration
							? t(`changed`, { duration })
							: t(`removed`)
					)
			]
		})
	}
}

interface CommandOptions {
	duration: number
}
