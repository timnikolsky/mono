import { Command } from '@base/Command'
import { MonoEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import emojis from '../../assets/emojis'
import { CommandCategory } from '../../enums'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'bot-info',
			options: [],
			category: CommandCategory.GENERAL
		})
	}

	async execute({ interaction, t }: CommandContext) {
		await interaction.reply({
			embeds: [
				new MonoEmbed()
					.setThumbnail('https://media.discordapp.net/attachments/858415255422894090/962446400078090291/unknown.png?width=640&height=640')
					.setTitle(t('title'))
					.setDescription(`${t('description')}\n[${t('supportServer')}](${this.client.config.monoLoungeInviteLink}) · [BotiCord](https://boticord.top/bot/832944817671634944)`) // · [${t('website')}](https://mono-bot.vercel.app)
					.addField(t('servers'), `${this.client.guilds.cache.size}`, true)
					// .addField('users', `${this.client.users.cache.size}`, true)
			],
			ephemeral: true
		})
	}
}
