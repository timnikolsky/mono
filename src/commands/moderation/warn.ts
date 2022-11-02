import { Command } from '@base/Command'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandCategory, CommandOptionTypes } from '../../enums'
import { GuildMember, GuildMemberRoleManager, User } from 'discord.js'
import MonoGuildMember from '@base/discord.js/GuildMember'
import Paginator from '@base/Paginator'
import { MonoEmbed, ErrorEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import { formatTimestamp, formatUser } from '@utils/formatters'
import user from '@commands/information/user'
import Mono from '@base/Mono'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'warn',
			options: [{
				id: 'add',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'user',
					type: CommandOptionTypes.USER,
					required: true
				}, {
					id: 'text',
					type: CommandOptionTypes.STRING,
				}]
			}, {
				id: 'remove',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'warn-id',
					type: CommandOptionTypes.INTEGER,
					minValue: 1,
					required: true
				}]
			}],
			userPermissionsRequired: ['BanMembers'],
			module: 'moderation',
			category: CommandCategory.MODERATION
		})
	}

	async execute({ interaction, t }: CommandContext, { subCommand, user, text, warnId }: CommandOptions) {
		if(subCommand === 'add') {
			let member: MonoGuildMember
			try {
				member = this.guild.members.cache.get(user.id) as MonoGuildMember
			} catch(e) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('memberNotFound'))]
				})
				return
			}

			if(user.equals(interaction.user)) {
				await interaction.reply({
					embeds: [new InfoEmbed(t('cantBanSelf'))]
				})
				return
			}

			if(
				(interaction.member as MonoGuildMember)!.roles.highest.position <= member.roles.highest.position
				&& interaction.user.id !== this.guild.ownerId
			) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('superior'))]
				})
				return
			}

			await member.addWarning(interaction.user.id, text)
			await interaction.reply({
				embeds: [new SuccessEmbed(t('warned', {
					executor: interaction.user,
					member: user,
					text: text ?? t('noTextProvided')
				}))]
			})

			return
		}

		if(subCommand === 'remove') {
			const warning = await this.client.database.warning.findFirst({
				where: {
					guildId: this.guild.id,
					id: warnId,
					deleted: false
				}
			})

			if(!warning) {
				await interaction.reply({
					embeds: [new InfoEmbed(t('warningNotFound'))]
				})
				return
			}

			// Warning is not actually deleted to not break local id incrementing
			await this.client.database.warning.update({
				where: {
					globalId: warning.globalId
				},
				data: {
					deleted: true
				}
			})

			await interaction.reply({
				embeds: [new SuccessEmbed(t('warningRemoved', {
					user: `<@${warning.userId}>`
				}))]
			})
		}
	}
}

interface CommandOptions {
	subCommand: 'add' | 'remove',
	user: User,
	warnId: number,
	text?: string
}
