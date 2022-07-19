import { Command } from '@base/Command'
import { SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { getTranslatorFunction } from '@utils/localization'
import Console from '@utils/console'
import chalk from 'chalk'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'language',
			options: [{
				id: 'language-code',
				type: CommandOptionTypes.STRING,
				choices: guild.client.languages.map(language => ({
					id: language,
					value: language
				})),
				required: true
			}],
			disabledGlobally: false
		})
	}

	async execute({ interaction, t }: CommandContext, { languageCode }: CommandOptions) {
		await this.guild.setLanguage(languageCode)

		// Get new translation function, because old one use previous language
		t = getTranslatorFunction(languageCode)

		await interaction.reply({
			embeds: [new SuccessEmbed(t('commands:language.languageChanged'))]
		})

		try {
			await this.guild.uploadCommands()
		} catch(e) {
			Console.error(`'Couldn't upload slash commands to guild '${this.guild.name}'`)
		}

		Console.action(`'${this.guild.name}' guild language has been changed to ${chalk.bold(languageCode)}`)
	}
}

interface CommandOptions {
	languageCode: string
}
