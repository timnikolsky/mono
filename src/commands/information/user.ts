import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import MonoGuild from '@base/discord.js/Guild'
import MonoGuildMember from '@base/discord.js/GuildMember'
import MonoUser from '@base/discord.js/User'
import { MonoEmbed } from '@base/Embed'
import { ImageExtension } from '@discordjs/rest'
import { MonoCommand } from '@typings/index'
import emojis from '../../assets/emojis'
import { CommandCategory, CommandOptionTypes } from '../../enums'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'user',
			options: [{
				id: 'user',
				type: CommandOptionTypes.USER
			}],
			category: CommandCategory.INFORMATION
		})
	}

	async execute({ interaction, t }: CommandContext, options: CommandOptions) {
		const member = interaction.guild?.members.cache.get(options.user?.id || interaction.user.id) as MonoGuildMember
		if(!member || !interaction.guild) {
			await interaction.reply({
				embeds: [
					new MonoEmbed()
						.setDescription('oops')
				]
			})
			return
		}
		if(member.partial) await member.fetch()

		const avatarExtensions = ['webp', 'png', 'jpg', 'jpeg']
		if(member.user.displayAvatarURL({ forceStatic: false }).endsWith('.gif')) avatarExtensions.push('gif')

		const badges = []
		if(member.user.id === interaction.guild?.ownerId) badges.push('owner')
		if(member.permissions.has('BanMembers')) badges.push('moderator')
		if(member.premiumSince) badges.push('booster')
		if(member.user.isStaff) badges.push('monoStaff')

		await interaction.reply({
			embeds: [
				new MonoEmbed()
					// @ts-ignore
					.setTitle(`${member.user.tag} ${badges.map(b => emojis.badge[b]).join(' ')}`)
					.setThumbnail(member.user.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false }))
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
						avatarExtensions.map((ext) => `[${ext}](${member.user.displayAvatarURL({ extension: ext as ImageExtension })})`).join(', '),
						true
					)
					.addField(
						t('permissions'),
						member.permissions.toArray().includes('Administrator') ?
							`\`${t(`common:permissions.Administrator`)}\`` :
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
