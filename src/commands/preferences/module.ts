import { Command } from '@base/Command'
import { MonoEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import Module from '@base/Module'
import moduleIcons from '../../assets/moduleIcons'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'module',
			options: ['info', 'enable', 'disable'].map(id => ({
				id: id,
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'module',
					type: CommandOptionTypes.MODULE,
					required: true
				}]
			}))
		})
	}

	async execute({ interaction, t }: CommandContext, { subCommand, module }: CommandOptions) {
		// @ts-ignore
		const moduleName = Object.keys(this.guild.modules).find(key => this.guild.modules[key].id === module)
		if(['enable', 'disable'].includes(subCommand)) {
			// @ts-ignore
			await this.guild.modules[moduleName].setEnabled(subCommand === 'enable')
			await interaction.reply({
				embeds: [
					new SuccessEmbed(
						subCommand === 'enable'
							? t('moduleEnabled', {
								module: t(`modules:${moduleName}.name`)
							})
							: t('moduleDisabled', {
								module: t(`modules:${moduleName}.name`)
							})
					)
				]
			})
			await this.guild.uploadCommands()
			return
		}
		if(subCommand === 'info') {
			await interaction.reply({
				embeds: [
					new MonoEmbed()
						.setTitle(t(`modules:${moduleName}.name`))
						.setDescription(t(`modules:${moduleName}.description`))
						// @ts-ignore
						.setThumbnail(moduleIcons[moduleName])
				]
			})
		}
	}
}

interface CommandOptions {
	subCommand: 'enable' | 'disable' | 'info',
	module: string
}
