import { Command } from '@base/Command'
import { SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { BaseGuildTextChannel } from 'discord.js'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'purge',
			options: [{
				id: 'amount',
				type: CommandOptionTypes.INTEGER,
				minValue: 1,
				maxValue: 100,
				required: true
			}],
			botPermissionsRequired: ['MANAGE_MESSAGES'],
			module: 'moderation'
		})
	}

	async execute({ interaction, t }: CommandContext, { amount }: CommandOptions) {
		await (interaction.channel as BaseGuildTextChannel).bulkDelete(amount, true)
		await interaction.reply({
			embeds: [
				new SuccessEmbed(t('deleted', { amount }))
			],
			ephemeral: true
		})
	}
}

interface CommandOptions {
	amount: number
}
