import { Command } from '@base/Command'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandCategory, CommandOptionTypes } from '../../enums'
import { GuildMember, User } from 'discord.js'
import MonoGuildMember from '@base/discord.js/GuildMember'
import Paginator from '@base/Paginator'
import { MonoEmbed, InfoEmbed, SuccessEmbed } from '@base/Embed'
import { formatTimestamp, formatUser } from '@utils/formatters'
import user from '@commands/information/user'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'warnings',
			options: [{
				id: 'user',
				type: CommandOptionTypes.USER
			}],
			module: 'moderation',
			category: CommandCategory.MODERATION
		})
	}

	async execute({ interaction, t }: CommandContext, { user }: CommandOptions) {
		const member = (await this.guild.members.fetch(user ?? interaction.user)) as MonoGuildMember

		const warnings = await member.getWarnings()

		if(!warnings.length) {
			await interaction.reply({
				embeds: [new InfoEmbed('noWarnings')]
			})
			return
		}

		const paginator = new Paginator({
			member: interaction.member! as GuildMember,
			data: warnings,
			payloadGenerator: async (warning) => {
				return {
					embeds: [
						new MonoEmbed()
							.setAuthor({
								name: member.displayName,
								iconURL: member.displayAvatarURL()
							})
							.setTitle(t('title'))
							.setDescription(warning.content || t('noTextProvided'))
							.addField(
								t('executor'),
								formatUser(await this.client.users.fetch(warning.executorId)),
								true
							)
							.addField(
								t('date'),
								formatTimestamp(+warning.createdAt, 'd'),
								true
							)
							.addField(
								t('warningId'),
								warning.id.toString(),
								true
							)
					]
				}
			}
		})

		await paginator.init(interaction)
	}
}

interface CommandOptions {
	user?: User
}
