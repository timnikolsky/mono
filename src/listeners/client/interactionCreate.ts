import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { CommandInteraction, InteractionType } from 'discord.js'
import { Command } from '@base/Command'
import MonoGuild from '@base/discord.js/Guild'
import CommandContext from '@base/CommandContext'
import { MiddlewareContext } from '@typings/index'
import { MiddlewareResult } from '../../enums'
import { ErrorEmbed } from '@base/Embed'
import Console from '@utils/console'
import { getTranslatorFunction } from '@utils/localization'

export default new Listener(
	'interactionCreate',
	async (client: Mono, interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return
		if (!interaction.inGuild()) return

		const command: Command = new (client.commands.filter(command => new command(interaction.guild as MonoGuild).id === interaction.commandName)[0])(interaction.guild as MonoGuild)

		const context = new CommandContext(interaction, getTranslatorFunction((interaction.guild as MonoGuild).language, `commands:${command.id}`))

		const middlewareContext: MiddlewareContext = {
			interaction,
			command,
			commandContext: context,
			commandOptions: {
				subCommand: interaction.options.getSubcommand(false),
				subCommandGroup: interaction.options.getSubcommandGroup(false),
			}
		}

		const middlewareResult = await client.middlewareManager.handle(middlewareContext)

		if (middlewareResult === MiddlewareResult.BREAK) return

		const options = middlewareContext.commandOptions

		// for(const discordOption of interaction.options.data) {
		// 	if(discordOption.type === 'USER') {
		// 		// @ts-ignore
		// 		options[discordOption.name] = await client.users.fetch(discordOption.value)
		// 	} else {
		// 		// @ts-ignore
		// 		options[discordOption.name] = discordOption.value
		// 	}
		//
		// 	if(discordOption.options)
		// 	for(const discordSubOption of discordOption.options) {
		// 		if(discordSubOption.type === 'USER') {
		// 			// @ts-ignore
		// 			options[discordSubOption.name] = await client.users.fetch(discordSubOption.value)
		// 		} else {
		// 			// @ts-ignore
		// 			options[discordSubOption.name] = discordSubOption.value
		// 		}
		// 	}
		// }

		try {
			await new (client.commands.filter(command => new command(interaction.guild as MonoGuild).id === interaction.commandName)[0])(interaction.guild as MonoGuild).execute(context, options)
		} catch (e) {
			try {
				await interaction.editReply({
					embeds: [new ErrorEmbed('There was an error')],
					components: [],
					attachments: [],
					files: []
				})
			} catch (e) {
				await interaction.reply({
					embeds: [new ErrorEmbed('There was an error')]
				})
			} finally {
				Console.error(`Error while running command '${interaction.commandName}':`)
				console.log(e)
			}
		}
	}
)
