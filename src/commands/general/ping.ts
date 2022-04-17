import { Command } from '@base/Command'
import { Embed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import ModerationModule from '@modules/Moderation'
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
				new Embed()
					.setDescription(`${emojis.pingPong} ${t('pong', { ping: this.client.ws.ping })}`)
			]
		})
	}
}
