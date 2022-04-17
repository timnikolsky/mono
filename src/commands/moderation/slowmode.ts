import { Command } from '@base/Command'
import { Embed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { TextChannel } from 'discord.js'

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
			botPermissionsRequired: ['MANAGE_CHANNELS'],
			module: 'moderation'
		})
	}

	async execute({ interaction, t }: CommandContext, { duration }: CommandOptions) {
		await (interaction.channel as TextChannel).setRateLimitPerUser(duration)
		await interaction.reply({
			embeds: [
				new Embed()
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
