import { Command } from '@base/Command'
import { InfoEmbed, MonoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { GuildModules, MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import Module from '@base/Module'
import moduleIcons from '../../assets/moduleIcons'
import { ActionRowBuilder, ButtonStyle, Guild, MessageActionRowComponentBuilder, SelectMenuBuilder, SelectMenuInteraction } from 'discord.js'
import emojis from '../../assets/emojis'
import { ButtonBuilder } from '@discordjs/builders'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'module',
			options: ['info', 'enable', 'disable'].map(id => ({
				id: id,
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'module',
					type: CommandOptionTypes.MODULE,
					required: id !== 'info'
				}]
			})),
			userPermissionsRequired: ['ManageGuild'],
		})
	}

	async execute({ interaction, t }: CommandContext, { subCommand, module }: CommandOptions) {
		const moduleIds = Object.keys(this.guild.modules) as (keyof GuildModules)[]
		const specifiedModuleId = moduleIds.find(key => this.guild.modules[key].id === module)

		if(subCommand === 'info') {
			let moduleSelectedId = specifiedModuleId ?? null
			
			const renderModuleSelect = () => {
				const moduleSelect = new SelectMenuBuilder()
					.setCustomId('moduleSelect')
					.setMinValues(1)
					.setMaxValues(1)
					.setPlaceholder(t('selectModule'))
					.addOptions(moduleIds.map(id => ({
						label: t(`modules:${id}.name`),
						value: id,
						default: moduleSelectedId === id,
						emoji: emojis.switch[this.guild.modules[id].enabled ? 'on' : 'off']
					})))
	
				return moduleSelect
			}

			const renderModuleMessagePayload = () => {
				const embed = new MonoEmbed()
					.setTitle(t(`modules:${moduleSelectedId}.name`))
					.setDescription(t(`modules:${moduleSelectedId}.description`))
					.setThumbnail(moduleIcons[moduleSelectedId!])

				const isSelectedModuleEnabled = this.guild.modules[moduleSelectedId!].enabled
	
				const toggleButton = new ButtonBuilder()
					.setLabel(isSelectedModuleEnabled ? t('common:disable') : t('common:enable'))
					.setCustomId(isSelectedModuleEnabled ? 'disable' : 'enable')
					.setStyle(isSelectedModuleEnabled ? ButtonStyle.Danger : ButtonStyle.Success)
	
				return {
					embeds: [embed],
					components: [
						new ActionRowBuilder<MessageActionRowComponentBuilder>()
							.addComponents([
								renderModuleSelect()
							]),
						new ActionRowBuilder<MessageActionRowComponentBuilder>()
							.addComponents([
								toggleButton
							])
					]
				}
			}

			const message = await interaction.reply(
				specifiedModuleId
					? renderModuleMessagePayload()
					: {
						embeds: [
							new MonoEmbed()
								.setTitle(t('modulesListTitle'))
								.setDescription(t('modulesListDescription'))
						],
						components: [
							new ActionRowBuilder<MessageActionRowComponentBuilder>()
								.addComponents([
									renderModuleSelect()
								]),
						]
					}

			)

			const collector = message.createMessageComponentCollector({
				filter: (i) => i.user.equals(interaction.user)
			})

			collector.on('collect', async (componentInteraction) => {
				if(componentInteraction.customId === 'moduleSelect') {
					moduleSelectedId = (componentInteraction as SelectMenuInteraction).values[0] as keyof GuildModules
					await interaction.editReply(renderModuleMessagePayload())
					await componentInteraction.deferUpdate()
				}

				if(componentInteraction.customId === 'enable') {
					this.guild.modules[moduleSelectedId!].enabled = true
					await interaction.editReply(renderModuleMessagePayload())
					await componentInteraction.deferUpdate()
					await this.guild.uploadCommands()
				}

				if(componentInteraction.customId === 'disable') {
					this.guild.modules[moduleSelectedId!].enabled = false
					await interaction.editReply(renderModuleMessagePayload())
					await componentInteraction.deferUpdate()
					await this.guild.uploadCommands()
				}
			})

			return
		}

		if(['enable', 'disable'].includes(subCommand)) {
			const module = this.guild.modules[specifiedModuleId!]

			// If module is already enabled/disabled, don't do anything
			if(module.enabled === (subCommand === 'enable')) {
				await interaction.reply({
					embeds: [new InfoEmbed(
						subCommand === 'enable'
							? t('moduleAlreadyEnabled', {
								module: t(`modules:${specifiedModuleId}.name`)
							})
							: t('moduleAlreadyDisabled', {
								module: t(`modules:${specifiedModuleId}.name`)
							})
					)]
				})
				return
			}

			await module.setEnabled(subCommand === 'enable')

			await interaction.reply({
				embeds: [
					new SuccessEmbed(
						subCommand === 'enable'
							? t('moduleEnabled', {
								module: t(`modules:${specifiedModuleId}.name`)
							})
							: t('moduleDisabled', {
								module: t(`modules:${specifiedModuleId}.name`)
							})
					)
				]
			})
			await this.guild.uploadCommands()
			return
		}
	}
}

interface CommandOptions {
	subCommand: 'enable' | 'disable' | 'info',
	module?: string
}
