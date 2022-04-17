// import { Command } from '@base/Command'
// import { Collection, CommandInteraction, DynamicImageFormat } from 'discord.js'
// import { Embed } from '@base/Embed'
// import MonoGuild from '@base/discord.js/Guild'
// import { TFunction } from 'i18next'
// import { formatUser } from '@utils/formatters'
// import emojis from '../../assets/emojis'
// import { MonoCommand } from '@typings/index'
//
// export default class GuildCommand extends Command implements MonoCommand {
// 	constructor(guild: MonoGuild) {
// 		super(guild, {
// 			name: 'guild',
// 			options: (guild) => []
// 		})
// 	}
//
// 	async execute(interaction: CommandInteraction, t: TFunction) {
// 		const guild = interaction.guild
// 		if(!guild) return
//
// 		const guildOwner = await this.client.users.fetch(guild.ownerId)
// 		const members = guild.members.cache.size
// 		const bots = guild.members.cache.filter<Collection>(item => item.user.bot, { return: 'collection' }).size
//
// 		await interaction.reply({
// 			embeds: [
// 				new Embed()
// 					.setTitle(guild.name)
// 					.setThumbnail(guild.iconURL({ size: 512 }) || `https://cdn.discordapp.com/embed/avatars/${parseInt(guild.id) % 6}.png`)
// 					.addField(t('owner'), formatUser(guildOwner), true)
// 					.addField(t('members'), `${members} ${emojis.user} (${bots} ${emojis.bot})`, true)
// 					.addField(t('created'), `${'hi'}`, true)
// 			]
// 		})
// 	}
// }
