import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { AutocompleteInteraction, CommandInteraction, InteractionType } from 'discord.js'
import { Command } from '@base/Command'
import MonoGuild from '@base/discord.js/Guild'
import CommandContext from '@base/CommandContext'
import { MiddlewareContext } from '@typings/index'
import { MiddlewareResult } from '../../enums'
import { ErrorEmbed } from '@base/Embed'
import Console from '@utils/console'
import { getTranslatorFunction } from '@utils/localization'
import { generateMemberInfoEmbed } from '@commands/information/user'

export default new Listener(
	'interactionCreate',
	async (client: Mono, interaction: CommandInteraction | AutocompleteInteraction) => {
		if (interaction.isUserContextMenuCommand()) {
			if(interaction.commandName === 'info') {
				const user = interaction.options.getUser('user')!
				const guild = client.guilds.cache.get(interaction.guildId!) as MonoGuild
				const t = getTranslatorFunction((interaction.guild as MonoGuild).language, `commands:user`)
				const member = await guild.members.fetch(user.id)
				if(!member) {
					await interaction.reply({
						embeds: [
							new ErrorEmbed(t('invalidUser'))
						]
					})
					return
				}

				interaction.reply({
					embeds: [
						generateMemberInfoEmbed(member, t)
					]
				})
			}
			return
		}

		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return
		if (!interaction.inGuild()) return

		const command: Command = new (client.commands.filter(command => new command(interaction.guild as MonoGuild).id === interaction.commandName)[0])(interaction.guild as MonoGuild)

		if(interaction instanceof AutocompleteInteraction) {
			const focusedOption = await interaction.options.getFocused(true)

			if(command.autocomplete) {
				let result = await command.autocomplete(focusedOption.value)

				if(result.length > 25) {
					result = result.slice(0, 25)
					Console.warning(`Autocomplete result for \`${interaction.commandName}\` command was longer than 25 items, so it was cut off. You should better handle it in command congfiguration.`)
				}

				await interaction.respond(result)
			}
			
			return
		}


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
