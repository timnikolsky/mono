import { MiddlewareContext } from '@typings/index'
import { MiddlewareResult } from '../enums'
import MonoGuild from '@base/discord.js/Guild'
import Module from '@base/Module'
import { getTranslatorFunction } from '@utils/localization'
import { InfoEmbed } from '@base/Embed'

/*
	In case of problem with updating slash commands
 */

export default async function(context: MiddlewareContext) {
	const guild = context.commandContext.interaction?.guild as MonoGuild
	if(!guild) return MiddlewareResult.BREAK

	const module = context.command.module

	if(module) {
		const guildModule: Module = guild.modules[module]
		if(!guildModule.enabled) {
			const t = getTranslatorFunction((context.interaction.guild as MonoGuild).language)
			await context.commandContext.interaction.reply({
				embeds: [new InfoEmbed(t('common:alertMessages.moduleRequired', {
					moduleName: t(`modules:${module}.name`)
				}))]
			})
			return MiddlewareResult.BREAK
		}
	}

	return MiddlewareResult.NEXT
}
