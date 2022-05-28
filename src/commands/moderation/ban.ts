import { Command } from '@base/Command'
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { GuildMemberRoleManager, User } from 'discord.js'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'ban',
			options: [{
				id: 'user',
				type: CommandOptionTypes.USER,
				required: true
			}, {
				id: 'reason',
				type: CommandOptionTypes.STRING
			}, {
				id: 'clean-days',
				type: CommandOptionTypes.INTEGER,
				minValue: 0,
				maxValue: 7
			}],
			botPermissionsRequired: ['BanMembers'],
			module: 'moderation'
		})
	}

	async execute({ interaction, t }: CommandContext, { user, reason, cleanDays }: CommandOptions) {
		let member
		try {
			member = await this.guild.members.fetch(user)
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

		if(!member.bannable) {
			await interaction.reply({
				embeds: [new ErrorEmbed(t('missingPermissions'))]
			})
			return
		}

		if(
			(interaction.member!.roles as GuildMemberRoleManager).highest.position <= member.roles.highest.position
			&& interaction.user.id !== this.guild.ownerId
		) {
			await interaction.reply({
				embeds: [new ErrorEmbed(t('superior'))]
			})
			return
		}

		// I'm not sure if it is necessary
		if(this.guild.bans.cache.some((ban) => ban.user.equals(user))) {
			await interaction.reply({
				embeds: [new ErrorEmbed(t('alreadyBanned'))]
			})
			return
		}

		await member.ban({
			reason: `${interaction.user.tag} | ${reason ?? t('common:noReasonProvided')}`,
			deleteMessageDays: cleanDays
		})

		await interaction.reply({
			embeds: [new SuccessEmbed(t('banned', {
				executor: interaction.user,
				member: user,
				reason: reason ?? t('common:noReasonProvided')
			}))]
		})
	}
}

interface CommandOptions {
	user: User,
	reason?: string,
	cleanDays?: number
}
