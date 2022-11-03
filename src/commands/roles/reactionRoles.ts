import { Command } from '@base/Command'
import { MonoEmbed, ErrorEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandCategory, CommandOptionTypes } from '../../enums'
import {
	Emoji,
	GuildChannelResolvable,
	GuildMember,
	GuildTextBasedChannel,
	Message,
	ActionRowBuilder,
	ButtonBuilder,
	SelectMenuBuilder,
	Role,
	SelectMenuInteraction,
	ButtonStyle,
	MessageActionRowComponentBuilder,
	PermissionFlagsBits
} from 'discord.js'
import Paginator from '@base/Paginator'
import emojis from '../../assets/emojis'
import { formatMessage } from '@utils/formatters'
import RolesModule from '@modules/Roles'
import { ReactionRole, ReactionRoleMessage } from '@prisma/client'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'reaction-roles',
			options: [{
				id: 'create',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'message',
					type: CommandOptionTypes.MESSAGE,
					required: true
				}, {
					id: 'role',
					type: CommandOptionTypes.ROLE,
					required: true
				}, {
					id: 'emoji',
					type: CommandOptionTypes.EMOJI,
					required: true
				}]
			}, {
				id: 'list',
				type: CommandOptionTypes.SUB_COMMAND
			}, {
				id: 'delete',
				type: CommandOptionTypes.SUB_COMMAND_GROUP,
				options: [{
					id: 'message',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [{
						id: 'message',
						type: CommandOptionTypes.MESSAGE,
						required: true
					}]
				}, {
					id: 'role',
					type: CommandOptionTypes.SUB_COMMAND,
					options: [{
						id: 'role',
						type: CommandOptionTypes.ROLE,
						required: true
					}]
				}]
			}],
			userPermissionsRequired: [PermissionFlagsBits.ManageGuild],
			module: 'roles',
			category: CommandCategory.ROLES
		})
	}

	async execute({ interaction, t }: CommandContext, options: CommandOptions) {
		if (options.subCommand === 'create') {
			if (options.role!.managed) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('managedRole'))]
				})
				return
			}

			if (
				!this.guild.members.me!.permissions.has('ManageRoles')
				|| this.guild.members.me!.roles.highest.comparePositionTo(options.role!) < 0
			) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('commands:autorole.cantAccessRole'))]
				})
				return
			}

			const messageChannelPermissions = options.message!.guild!.members.me!
				.permissionsIn(options.message!.channel as GuildChannelResolvable)

			if (!messageChannelPermissions.has('AddReactions')) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('missingPermissions'))]
				})
			}

			// Check if this reaction role already exists
			let reactionRole = await this.client.database.reactionRole.findFirst({
				where: {
					roleId: options.role!.id
				}
			})

			if (reactionRole) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('alreadyExists'))]
				})
				return
			}

			let reactionRoleMessage = await this.client.database.reactionRoleMessage.findFirst({
				where: {
					id: options.message!.id
				}
			})

			// If reaction role message doesn't exist yet, suggest user to create one
			if (!reactionRoleMessage) {
				await interaction.reply({
					embeds: [
						new MonoEmbed()
							.setDescription(t('creationDescription'))
					],
					components: [
						new ActionRowBuilder<MessageActionRowComponentBuilder>()
							.setComponents([
								new SelectMenuBuilder()
									.setCustomId('mode')
									.setPlaceholder(t('chooseMode'))
									.setOptions([{
										label: t('modes.standard.name'),
										description: t('modes.standard.description'),
										value: '0'
									}, {
										label: t('modes.unique.name'),
										description: t('modes.unique.description'),
										value: '1'
									}, {
										label: t('modes.addOnly.name'),
										description: t('modes.addOnly.description'),
										value: '2'
									}, {
										label: t('modes.removeOnly.name'),
										description: t('modes.removeOnly.description'),
										value: '3'
									}])
							]),
						new ActionRowBuilder<MessageActionRowComponentBuilder>()
							.setComponents([
								new ButtonBuilder()
									.setCustomId('cancel')
									.setLabel(t('common:cancel'))
									.setStyle(ButtonStyle.Secondary)
							])
					]
				})

				const replyMessage = await interaction.fetchReply() as Message

				const componentInteraction = await replyMessage.awaitMessageComponent({
					filter: (i) => i.user.id === interaction.user.id
				})

				if (componentInteraction.customId === 'cancel') {
					await replyMessage.delete()
					return
				}

				await this.client.database.reactionRoleMessage.create({
					data: {
						id: options.message!.id,
						channelId: options.message!.channel.id,
						guildId: options.message!.guild!.id,
						mode: parseInt((componentInteraction as SelectMenuInteraction).values[0])
					}
				})

				await this.client.database.reactionRole.create({
					data: {
						emoji: options.emoji?.id || options.emoji!.name!,
						roleId: options.role!.id,
						messageId: options.message!.id
					}
				})

				await interaction.editReply({
					embeds: [new SuccessEmbed(t('created', {
						emoji: options.emoji!,
						role: options.role!
					}))],
					components: [] // Remove components from message
				})

				await options.message!.react(options.emoji!.id || options.emoji!.name!)

				return
			}

			await this.client.database.reactionRole.create({
				data: {
					emoji: options.emoji?.id || options.emoji!.name!,
					roleId: options.role!.id,
					messageId: options.message!.id
				}
			})

			await options.message!.react(options.emoji!.id || options.emoji!.name!)

			await interaction.reply({
				embeds: [new SuccessEmbed(t('created', {
					emoji: options.emoji!,
					role: options.role!
				}))],
			})
			return
		}

		if (options.subCommand === 'list') {
			const reactionRoleMessagesRaw = await this.client.database.reactionRoleMessage.findMany({
				where: {
					guildId: interaction.guild!.id
				},
				include: {
					reactionRoles: true
				}
			})

			const reactionRoleMessages = [] as (ReactionRoleMessage & {
				reactionRoles: ReactionRole[];
			})[]

			for (const reactionRoleMessage of reactionRoleMessagesRaw) {
				try {
					const channel = await this.client.channels.fetch(reactionRoleMessage.channelId) as GuildTextBasedChannel
					const message = await channel.messages.fetch(reactionRoleMessage.id)
					if(message) {
						reactionRoleMessages.push(reactionRoleMessage)
					}
				} catch (e) {
					continue
				}
			}

			if(reactionRoleMessagesRaw.length === 0) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('noMessages'))]
				})
				return
			}

			let modes = [
				'standard',
				'unique',
				'addOnly',
				'removeOnly'
			]

			const paginator = new Paginator({
				member: interaction.member as GuildMember,
				data: reactionRoleMessages,
				payloadGenerator: async (data) => {
					const channel = await this.client.channels.fetch(data.channelId) as GuildTextBasedChannel
					const message = await channel.messages.fetch(data.id)
					return {
						embeds: [
							new MonoEmbed()
								.setTitle(`#${channel.name}`)
								.addField(
									t('message'),
									formatMessage(t, message),
									true
								)
								.addField(
									t('mode'),
									[0, 1, 2, 3].map(mode => {
										const isSelected = mode === data.mode
										return `${emojis.radio[isSelected ? 'on' : 'off']} ${t(`modes.${modes[mode]}.name`)}`
									}).join('\n'),
									true
								)
								.addField(
									t('roles'),
									data.reactionRoles.map(rr => `${rr.emoji.length >= 18 ? `<:e:${rr.emoji}>` : rr.emoji} › <@&${rr.roleId}>`).join('\n'),
									true
								)
						]
					}
				}
			})

			await paginator.init(interaction)

			return
		}

		if (options.subCommandGroup === 'delete') {
			if (options.subCommand === 'message') {
				const reactionRoleMessage = await this.client.database.reactionRoleMessage.findFirst({
					where: {
						id: options.message!.id
					}
				})

				if (!reactionRoleMessage) {
					await interaction.reply({
						embeds: [new InfoEmbed('reaction role message not found')]
					})
					return
				}

				// Prisma doesn't support cascade deleting, so we delete reaction roles manually
				await this.client.database.reactionRole.deleteMany({
					where: {
						messageId: options.message!.id
					}
				})

				await this.client.database.reactionRoleMessage.delete({
					where: {
						id: options.message!.id
					}
				})

				await interaction.reply({
					embeds: [new SuccessEmbed(t('messageDeleted'))]
				})
				return
			}

			if (options.subCommand === 'role') {
				const reactionRole = await this.client.database.reactionRole.findFirst({
					where: {
						roleId: options.role!.id
					}
				})

				if (!reactionRole) {
					await interaction.reply({
						embeds: [new InfoEmbed(t('reactionRoleNotFound'))]
					})
					return
				}

				await this.client.database.reactionRole.deleteMany({
					where: {
						roleId: options.role!.id
					}
				})

				await interaction.reply({
					embeds: [new SuccessEmbed(t('reactionRoleDeleted'))]
				})
				return
			}
		}
	}
}

interface CommandOptions {
	subCommand: 'create' | 'list' | 'message' | 'role',
	subCommandGroup: 'delete'  | null
	message?: Message,
	role?: Role,
	emoji?: Emoji
}
