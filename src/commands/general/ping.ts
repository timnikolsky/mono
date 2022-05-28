import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import MonoGuild from '@base/discord.js/Guild'
import { MonoEmbed } from '@base/Embed'
import { MonoCommand } from '@typings/index'
import emojis from '../../assets/emojis'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'ping',
			options: []
		})
	}

	async execute({ interaction, t }: CommandContext) {
		await interaction.reply({
			embeds: [
				new MonoEmbed()
					.setDescription(`${emojis.pingPong} ${t('pong', { ping: this.client.ws.ping })}`)
			]
		})
	}
}
