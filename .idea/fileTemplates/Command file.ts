import { Command } from '@base/Command'
import { CommandInteraction } from 'discord.js'
import Mono from '@base/Mono'

export default class extends Command {
	constructor(client: Mono) {
		super(client, {
			name: '',
			options: []
		})
	}

	async execute(interaction: CommandInteraction) {
		
	}
}