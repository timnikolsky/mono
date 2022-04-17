// import { Command } from '@base/Command'
// import { CommandInteraction } from 'discord.js'
// import { Embed } from '@base/Embed'
// import MonoGuild from '@base/discord.js/Guild'
// import Mono from '@base/Mono'
// import Module from '@base/Module'
//
// export default class extends Command {
// 	constructor(guild: MonoGuild) {
// 		super(guild, {
// 			name: 'module',
// 			options: (guild) => [{
// 				name: 'enable',
// 				type: 1,
// 				options: [{
// 					name: 'module',
// 					type: 3,
// 					required: true,
// 					// @ts-ignore
// 					choices: Object.keys(guild.client.modules).map(moduleId => {
// 						return {
// 							// @ts-ignore
// 							name: guild.client.modules[moduleId].id,
// 							// @ts-ignore
// 							value: guild.client.modules[moduleId].id
// 						}
// 					})
// 				}]
// 			}, {
// 				name: 'disable',
// 				type: 1,
// 				options: [{
// 					name: 'module',
// 					type: 3,
// 					required: true,
// 					// @ts-ignore
// 					choices: Object.keys(guild.client.modules).map(moduleId => {
// 						return {
// 							// @ts-ignore
// 							name: guild.client.modules[moduleId].id,
// 							// @ts-ignore
// 							value: guild.client.modules[moduleId].id
// 						}
// 					})
// 				}]
// 			}, {
// 				name: 'info',
// 				type: 1,
// 				options: [{
// 					name: 'module',
// 					type: 3,
// 					required: true,
// 					// @ts-ignore
// 					choices: Object.keys(guild.client.modules).map(moduleId => {
// 						return {
// 							// @ts-ignore
// 							name: guild.client.modules[moduleId].id,
// 							// @ts-ignore
// 							value: guild.client.modules[moduleId].id
// 						}
// 					})
// 				}]
// 			}]
// 		})
// 	}
//
// 	async execute(interaction: CommandInteraction) {
// 		if(interaction.options.getSubcommand() === 'info') {
// 			// @ts-ignore
// 			const module = (interaction.client as Mono).modules[interaction.options.getString('module')]
// 			await interaction.reply({
// 				embeds: [
// 					new Embed()
// 						.setThumbnail(module.icon)
// 						.setTitle(module.id)
// 						.setDescription(`hello`)
// 				]
// 			})
// 		}
// 		if(interaction.options.getSubcommand() === 'enable') {
// 			// @ts-ignore
// 			const module = (interaction.client as Mono).modules[interaction.options.getString('module')]
// 			await interaction.reply({
// 				embeds: [
// 					new Embed()
// 						.setThumbnail(module.icon)
// 						.setTitle(module.id)
// 						.setDescription(`hello`)
// 				]
// 			})
// 		}
// 		if(interaction.options.getSubcommand() === 'disable') {
// 			// @ts-ignore
// 			const module = (interaction.client as Mono).modules[interaction.options.getString('module')]
// 			await interaction.reply({
// 				embeds: [
// 					new Embed()
// 						.setThumbnail(module.icon)
// 						.setTitle(module.id)
// 						.setDescription(`hello`)
// 				]
// 			})
// 		}
// 	}
// }
