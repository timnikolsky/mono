import MonoGuild from '@base/discord.js/Guild'
import { ErrorEmbed } from '@base/Embed'
import { MiddlewareContext } from '@typings/index'
import { getTranslatorFunction } from '@utils/localization'
import { GuildTextBasedChannel, PermissionResolvable } from 'discord.js'
import { MiddlewareResult } from '../enums'

export default async function(context: MiddlewareContext) {
	const channel = context.commandContext.interaction?.channel as GuildTextBasedChannel
	if(!channel) return MiddlewareResult.BREAK

	const { botPermissionsRequired } = context.command

	if(botPermissionsRequired) {
		const missedPermissions: PermissionResolvable[] = [];
		botPermissionsRequired.forEach((perm) => {
			if(!channel.guild.members.me?.permissionsIn(channel).has(perm)) {
				missedPermissions.push(perm)
			}
		})
		if(!channel.guild.members.me?.permissions.has(botPermissionsRequired)) {
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
