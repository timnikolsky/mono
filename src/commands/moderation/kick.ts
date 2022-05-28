import { Command } from '@base/Command'
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { BaseGuildTextChannel, GuildMemberRoleManager, User } from 'discord.js'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'kick',
			options: [{
				id: 'user',
				type: CommandOptionTypes.USER,
				required: true
			}, {
				id: 'reason',
				type: CommandOptionTypes.STRING
			}],
			botPermissionsRequired: ['KickMembers'],
			module: 'moderation'
		})
	}

	async execute({ interaction, t }: CommandContext, { user, reason }: CommandOptions) {
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
				embeds: [new InfoEmbed(('cantKickSelf'))]
			})
			return
		}

		if(!member.kickable) {
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

		await member.kick(`${interaction.user.tag} | ${reason ?? t('common:noReasonProvided')}`)

		await interaction.reply({
			embeds: [new SuccessEmbed(t('kicked', {
				executor: interaction.user,
				member: user,
				reason: reason ?? t('common:noReasonProvided')
			}))]
		})
	}
}

interface CommandOptions {
	user: User,
	reason?: string
}
