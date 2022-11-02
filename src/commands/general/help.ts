import { Command } from '@base/Command'
import { ErrorEmbed, MonoEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandCategory, CommandOptionTypes } from '../../enums'
import { ActionRowBuilder, GuildTextBasedChannel, MessageActionRowComponentBuilder, SelectMenuBuilder } from 'discord.js'
import emojis from '../../assets/emojis'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'help',
			options: [
				{
					id: 'command',
					type: CommandOptionTypes.STRING,
					required: false,
					autocomplete: true
				}
			],
			autocomplete: async (input: string | number) => {
				const commands = guild.initializedCommands
				if (!commands) return []

				const commandItems: {
					name: string
					value: string
				}[] = []

				for (const command of commands) {
					if (command.hasSubcommands || command.hasSubcommandGroups) {
						for (const option of command.options) {
							if (option.type === CommandOptionTypes.SUB_COMMAND) {
								commandItems.push({
									name: `${command.id} ${option.id}`,
									value: `${command.id}.${option.id}`
								})
							} else if (option.type === CommandOptionTypes.SUB_COMMAND_GROUP) {
								for (const suboption of option.options!) {
									commandItems.push({
										name: `${command.id} ${option.id} ${suboption.id}`,
										value: `${command.id}.${option.id}.${suboption.id}`
									})
								}
							}
						}
					} else {
						commandItems.push({
							name: command.id,
							value: command.id
						})
					}
				}

				return commandItems.filter((cmd) => cmd.name.startsWith(input.toString())).splice(0, 25)
			}
		})
	}

	async execute({ interaction, t }: CommandContext) {
		// Show help for a specific command
		const commandQuery = interaction.options.get('command')?.value as string

		if (commandQuery) {
			const [commandName, subcommandName, subsubcommandName] = commandQuery.split('.') as [string, string?, string?]

			const command = this.guild.initializedCommands!.find((cmd) => cmd.id === commandName)

			if (!command) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('commandNotFound'))]
				})
				return
			}

			if ((command.hasSubcommands || command.hasSubcommandGroups) && !subcommandName) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('commandNotFound'))]
				})
				return
			}

			if (subcommandName) {
				const subcommand = command.options.find((option) => option.id === subcommandName)

				if (!subcommand) {
					await interaction.reply({
						embeds: [new ErrorEmbed(t('commandNotFound'))]
					})
					return
				}

				if (subsubcommandName) {
					const subsubcommand = subcommand.options?.find((option) => option.id === subsubcommandName)

					if (!subsubcommand) {
						await interaction.reply({
							embeds: [new ErrorEmbed(t('commandNotFound'))]
						})
						return
					}
				}
			}

			const applicationCommand = this.guild.commands.cache.find((cmd) => cmd.name === command.id)

			const helpEmbed = new MonoEmbed()
				.setTitle(
					`</${commandName}${subcommandName ? ' ' + subcommandName : ''}${
						subsubcommandName ? ' ' + subsubcommandName : ''
					}:${applicationCommand?.id}>`
				)
				.setDescription(
					t(
						`commands:${commandName}._data.${subcommandName ? 'subcommands.' : ''}${[
							subcommandName,
							subsubcommandName
						]
							.filter(Boolean)
							.join('.subcommands.')}${subcommandName ? '.' : ''}description`
					)
				)
				.addField(
					t('userPermissionsRequired'),
					command.userPermissionsRequired
						?.map((perm) => `\`${t('common:permissions.' + perm)}\``)
						.join(', ') ?? t('none'),
					true
				)
			
			if(
				!command.botPermissionsRequired?.length ||
				command.botPermissionsRequired?.every(perm => this.guild.members.me?.permissionsIn(interaction.channel! as GuildTextBasedChannel).has(perm))
			) {
				helpEmbed.addField(
					t('botPermissionsRequired'),
					command.botPermissionsRequired
						?.map((perm) => `\`${t('common:permissions.' + perm)}\``)
						.join(', ') || t('none'),
					true
				)
			} else {
				helpEmbed.addField(
					t('botPermissionsRequired'),
					emojis.error + ' ' + t('missingPermissions') + '\n' + command.botPermissionsRequired
						?.map((perm) => {
							console.log(perm)
							if(this.guild.members.me?.permissionsIn(interaction.channel! as GuildTextBasedChannel).has(perm)) {
								return `\`${t('common:permissions.' + perm)}\``
							} else {
								return `__\`${t('common:permissions.' + perm)}\`__`
							}
						})
						.join(', ') || t('none'),
					true
				)
			}

			interaction.reply({
				embeds: [helpEmbed]
			})
			return
		}

		// Show all commands

		const helpEmbed = new MonoEmbed().setTitle(t('commandListTitle')).setFooter({ text: t('commandListFooter') })

		const commands = this.guild.initializedCommands!

		const categories: { [category: string]: string[] } = {}

		for (const command of commands) {
			categories[command.category] ??= []
			categories[command.category].push(command.id)
		}

		for (const category in categories) {
			helpEmbed.addField(
				t(`common:categories.${category}`),
				categories[category]
					.map((cmd) => {
						const applicationCommandId = this.guild.commands.cache.find(
							(command) => command.name === cmd
						)?.id
						return `</${cmd}:${applicationCommandId}>`
					})
					.join(', '),
				true
			)
		}

		await interaction.reply({
			embeds: [helpEmbed],
			ephemeral: false
		})
	}
}
