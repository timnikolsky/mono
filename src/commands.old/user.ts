// // import { Command } from '@base/Command'
// import { CommandInteraction, DynamicImageFormat } from 'discord.js'
// import { Embed } from '@base/Embed'
// import MonoGuild from '@base/discord.js/Guild'
// import { Command } from '@base/Command'
//
// export default class extends Command {
// 	constructor(guild: MonoGuild) {
// 		super(guild, {
// 			name: 'user',
// 			options: (guild) => [{
// 				name: 'user',
// 				type: 6,
// 				required: false
// 			}]
// 		})
// 	}
//
// 	async execute(interaction: CommandInteraction) {
// 		const member = interaction.guild?.members.cache.get(interaction.options.getUser('user')?.id || interaction.user?.id)
// 		if(!member) {
// 			await interaction.reply({
// 				embeds: [
// 					new Embed()
// 						.setDescription('oops')
// 				]
// 			})
// 			return
// 		}
// 		if(member.partial) await member.fetch()
// 		await interaction.reply({
// 			embeds: [
// 				new Embed()
// 					.setTitle(`${member.user.tag}`)
// 					.setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
// 					.addField('ID', `\`${member.user.id}\``, true)
// 					.addField(`Account created`, `<t:${Math.floor(member.user.createdTimestamp / 1000)}:d>`, true)
// 					.addField(`Joined server`, `<t:${Math.floor((member.joinedTimestamp || 0) / 1000)}:d>`, true)
// 					.addField(`Avatar`, ['webp', 'png', 'jpg', 'jpeg'].map(ext => `[${ext}](${member.user.displayAvatarURL({ format: ext as DynamicImageFormat, size: 1024 })})`).join(', '), true)
// 					.addField(`Permissions`, JSON.stringify(member.permissions.toArray()))
// 			]
// 		})
// 	}
// }
