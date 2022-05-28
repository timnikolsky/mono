import { ChatInputCommandInteraction, CommandInteraction } from 'discord.js'
import { TranslatorFunction } from '@typings/index'

export default class CommandContext {
    interaction: ChatInputCommandInteraction
	t: TranslatorFunction

    constructor(interaction: ChatInputCommandInteraction, t: TranslatorFunction) {
        this.interaction = interaction
	    this.t = t
    }
}
