import { Command } from '@base/Command'
import { MonoEmbed } from '@base/Embed'
import { MonoCommand } from '@typings/index'
import MonoGuild from '@base/discord.js/Guild'
import CommandContext from '@base/CommandContext'
import { CommandCategory } from '../../enums'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'eval',
			options: [{
				id: 'code',
				type: 2,
				required: true
			}, {
				id: 'ephemeral',
				type: 5
			}],
			staff: true,
			disabledGlobally: process.env.NODE_ENV === 'development' ?? guild.isDev,
			category: CommandCategory.STAFF
		})
	}

	async execute({ interaction }: CommandContext) {
		const result = eval(<string>interaction.options.getString('code'))
		await interaction.reply({
			embeds: [
				new MonoEmbed()
					.addField('Code Result', `\`\`\`js\n${result}\`\`\``)
			],
			ephemeral: interaction.options.getBoolean('ephemeral') ?? true
		})
	}
}