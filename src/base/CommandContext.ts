import { CommandInteraction } from 'discord.js'
import { TranslatorFunction } from '@typings/index'

export default class CommandContext {
    interaction: CommandInteraction
	t: TranslatorFunction

    constructor(interaction: CommandInteraction, t: TranslatorFunction) {
        this.interaction = interaction
	    this.t = t
    }
}
