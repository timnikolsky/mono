import { Command } from '@base/Command'
import { Embed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { DynamicImageFormat, User } from 'discord.js'
import emojis from '../../assets/emojis'
import MonoUser from '@base/discord.js/User'
import MonoGuildMember from '@base/discord.js/GuildMember'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'user',
			options: [{
				id: 'user',
				type: CommandOptionTypes.USER
			}]
		})
	}

	async execute({ interaction, t }: CommandContext, options: CommandOptions) {
		const member = interaction.guild?.members.cache.get(options.user?.id || interaction.user.id) as MonoGuildMember
		if(!member || !interaction.guild) {
			await interaction.reply({
				embeds: [
					new Embed()
						.setDescription('oops')
				]
			})
			return
		}
		if(member.partial) await member.fetch()

		const avatarExtensions = ['webp', 'png', 'jpg', 'jpeg']
		if(member.user.displayAvatarURL({ dynamic: true }).endsWith('.gif')) avatarExtensions.push('gif')

		const badges = []
		if(member.user.id === interaction.guild?.ownerId) badges.push('owner')
		if(member.permissions.has('BAN_MEMBERS')) badges.push('moderator')
		if(member.premiumSince) badges.push('booster')
		if(member.user.isStaff) badges.push('monoStaff')

		await interaction.reply({
			embeds: [
				new Embed()
					// @ts-ignore
					.setTitle(`${member.user.tag} ${badges.map(b => emojis.badge[b]).join(' ')}`)
					.setThumbnail(member.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
					.addField(
						t('common:id'),
						`\`${member.user.id}\``,
						true
					)
					.addField(
						t('created'),
						`<t:${Math.floor(member.user.createdTimestamp / 1000)}:d>`,
						true
					)
					.addField(
						t('joined'),
						`<t:${Math.floor((member.joinedTimestamp || 0) / 1000)}:d>`,
						true
					)
					.addField(
						t('avatar'),
						avatarExtensions.map((ext) => `[${ext}](${member.user.displayAvatarURL({ format: ext as DynamicImageFormat })})`).join(', '),
						true
					)
					.addField(
						t('permissions'),
						member.permissions.toArray().includes('ADMINISTRATOR') ?
							`\`${t(`common:permissions.ADMINISTRATOR`)}\`` :
							member.permissions.toArray()
								.filter(n => !interaction.guild?.roles.everyone.permissions.toArray().includes(n))
								.map(p => `\`${t(`common:permissions.${p}`)}\``)
								.join(', ') || t('common:none'),
						true
					)
			]
		})
	}
}

interface CommandOptions {
	user?: MonoUser
}
