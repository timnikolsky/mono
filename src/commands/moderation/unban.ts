import { Command } from '@base/Command'
import { ErrorEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandCategory, CommandOptionTypes } from '../../enums'
import { BaseGuildTextChannel, GuildMemberRoleManager, User } from 'discord.js'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'unban',
			options: [{
				id: 'user-id',
				type: CommandOptionTypes.STRING,
				required: true
			}, {
				id: 'reason',
				type: CommandOptionTypes.STRING
			}],
			botPermissionsRequired: ['BanMembers'],
			userPermissionsRequired: ['BanMembers'],
			module: 'moderation',
			category: CommandCategory.MODERATION
		})
	}

	async execute({ interaction, t }: CommandContext, { userId, reason }: CommandOptions) {
		if(!/\d{18,19}/.test(userId)) {
			await interaction.reply({
				embeds: [new InfoEmbed(t('invalidId'))]
			})
			return
		}

		await this.guild.bans.fetch()
		if(!this.guild.bans.cache.some((ban) => ban.user.id === userId)) {
			await interaction.reply({
				embeds: [new InfoEmbed(t('notBanned'))]
			})
			return
		}

		await this.guild.bans.remove(userId, reason)

		await interaction.reply({
			embeds: [new SuccessEmbed(t('unbanned', { id: userId }))]
		})
	}
}

interface CommandOptions {
	userId: string,
	reason?: string
}
