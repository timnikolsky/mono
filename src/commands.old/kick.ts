// import { Command } from '@base/Command'
// import { CommandInteraction } from 'discord.js'
// import MonoGuild from '@base/discord.js/Guild'
// import { Embed } from '@base/Embed'
//
// export default class extends Command {
// 	constructor(guild: MonoGuild) {
// 		super(guild, {
// 			name: 'kick',
// 			options: (guild) => [{
// 				name: 'user',
// 				type: 6,
// 				required: true
// 			}, {
// 				name: 'reason',
// 				type: 3,
// 				required: true
// 			}, {
// 				name: 'silent',
// 				type: 5,
// 				required: false
// 			}]
// 		})
// 	}
//
// 	async execute(interaction: CommandInteraction) {
// 		const member = interaction.guild?.members.cache.get(interaction.options.getUser('user')?.id || interaction.user?.id)
// 		if(!member) {
// 			await interaction.reply({
// 				embeds: [new Embed().setDescription('Cant find that member')]
// 			})
// 			return
// 		}
// 		if(!member.kickable) {
// 			await interaction.reply({
// 				embeds: [new Embed().setDescription('Cant kick this member')]
// 			})
// 			return
// 		}
//
// 		await member.kick('test')
// 		await interaction.reply({
// 			embeds: [new Embed().setDescription('Kicked')]
// 		})
// 	}
// }
