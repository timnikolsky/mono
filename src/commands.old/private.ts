// import { Command } from '@base/Command'
// import { CommandInteraction } from 'discord.js'
// import { Embed } from '@base/Embed'
// // import { CommandOptionTypes } from '@typings/index'
// import Mono from '@base/Mono'
// import { CommandOptionTypes } from '@typings/index'
// import MonoGuild from '@base/discord.js/Guild'
//
// export default class extends Command {
// 	constructor(guild: MonoGuild) {
// 		super(guild, {
// 			name: 'private',
// 			options: (guild) => [{
// 				name: 'name',
// 				type: 1, //CommandOptionTypes.SUB_COMMAND,
// 				options: [{
// 					name: 'name',
// 					type: 3,
// 					required: true
// 				}]
// 			}, {
// 				name: 'limit',
// 				type: 1, //CommandOptionTypes.SUB_COMMAND,
// 				options: [{
// 					name: 'limit',
// 					type: 4,
// 					required: true
// 				}]
// 			}, {
// 				name: 'hide',
// 				type: 1 //CommandOptionTypes.SUB_COMMAND,
// 			}, {
// 				name: 'show',
// 				type: 1 //CommandOptionTypes.SUB_COMMAND,
// 			}, {
// 				name: 'lock',
// 				type: 1 //CommandOptionTypes.SUB_COMMAND,
// 			}, {
// 				name: 'open',
// 				type: 1 //CommandOptionTypes.SUB_COMMAND,
// 			}, {
// 				name: 'kick',
// 				type: 1, //CommandOptionTypes.SUB_COMMAND,
// 				options: [{
// 					name: 'limit',
// 					type: 6,
// 					required: true
// 				}]
// 			}, {
// 				name: 'transmit',
// 				type: 1, //CommandOptionTypes.SUB_COMMAND,
// 				options: [{
// 					name: 'user',
// 					type: 6,
// 					required: true
// 				}]
// 			}]
// 		})
// 	}
//
// 	async execute(interaction: CommandInteraction) {
// 		const result = eval(<string> interaction.options.getString('code'))
// 		await interaction.reply({
// 			embeds: [
// 				new Embed()
// 					.addField('Code Result', `\`\`\`js\n${result}\`\`\``)
// 			],
// 			ephemeral: interaction.options.getBoolean('ephemeral') ?? true
// 		})
// 	}
// }
