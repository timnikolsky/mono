import { MiddlewareContext } from '@typings/index'
import { MiddlewareResult } from '../enums'
import { GuildTextBasedChannel, PermissionResolvable } from 'discord.js'
import { Embed, ErrorEmbed, InfoEmbed } from '@base/Embed'
import { getTranslatorFunction } from '@utils/localization'
import MonoGuild from '@base/discord.js/Guild'

export default async function(context: MiddlewareContext) {
	const channel = context.commandContext.interaction?.channel as GuildTextBasedChannel
	if(!channel) return MiddlewareResult.BREAK

	const { botPermissionsRequired } = context.command

	if(botPermissionsRequired) {
		const missedPermissions: PermissionResolvable[] = [];
		botPermissionsRequired.forEach((perm) => {
			if(!channel.guild.me?.permissionsIn(channel).has(perm)) {
				missedPermissions.push(perm)
			}
		})
		if(!channel.guild.me?.permissions.has(botPermissionsRequired)) {
			const t = getTranslatorFunction((channel.guild as MonoGuild).language)
			await context.commandContext.interaction.reply({
				embeds: [
					new ErrorEmbed(t('common:alertMessages.botMissingPermissions', {
						list: missedPermissions.map(permission => '`' + t(`permissions.${permission}`) + '`')
					}))
				]
			})
			return MiddlewareResult.BREAK
		}
	}
	return MiddlewareResult.NEXT
}
