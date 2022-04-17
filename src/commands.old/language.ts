// import { Command } from '@base/Command'
// import { CommandInteraction } from 'discord.js'
// import { Embed } from '@base/Embed'
// import MonoGuild from '@base/discord.js/Guild'
// import Mono from '@base/Mono'
// import { CommandOptionTypes } from '@typings/index'
// import { TFunction } from 'i18next'
//
// export default class extends Command {
// 	constructor(guild: MonoGuild) {
// 		super(guild, {
// 			name: 'language',
// 			options: (guild) => [{
// 				name: 'language',
// 				type: 3,
// 				required: true,
// 				choices: [{
// 					name: 'English',
// 					value: 'en'
// 				}, {
// 					name: 'Русский',
// 					value: 'ru'
// 				}]
// 				// ToDo: import lang list
// 				// choices: fs.readdirSync(path.resolve(__dirname, '../locales/')).map(files => {
// 				// 	const stat = fs.statSync(path.join(path.resolve(__dirname, '../locales/'), file));
// 				// })
// 			}]
// 		})
// 	}
//
// 	async execute(interaction: CommandInteraction, t: TFunction) {
// 		await (interaction.guild as MonoGuild)?.setLanguage(interaction.options.getString('language') || 'en')
// 		t = await this.guild.getTranslator()
// 		await interaction.reply({
// 			embeds: [
// 				new Embed()
// 					.setDescription(`${t`HELLO`}!`)
// 			]
// 		})
// 	}
// }
