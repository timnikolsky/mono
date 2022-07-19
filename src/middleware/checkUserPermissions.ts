import MonoGuild from '@base/discord.js/Guild'
import { ErrorEmbed } from '@base/Embed'
import { MiddlewareContext } from '@typings/index'
import { getTranslatorFunction } from '@utils/localization'
import { GuildMember, GuildTextBasedChannel, PermissionResolvable } from 'discord.js'
import { MiddlewareResult } from '../enums'

export default async function(context: MiddlewareContext) {
	const channel = context.commandContext.interaction?.channel as GuildTextBasedChannel
	if(!channel) return MiddlewareResult.BREAK

	const { userPermissionsRequired } = context.command

	if(userPermissionsRequired) {
		const missedPermissions: PermissionResolvable[] = [];
		userPermissionsRequired.forEach((perm) => {
			if(!(context.interaction.member as GuildMember).permissionsIn(channel).has(perm)) {
				missedPermissions.push(perm)
			}
		})
		if(missedPermissions.length > 0) {
			const t = getTranslatorFunction((channel.guild as MonoGuild).language)
			await context.commandContext.interaction.reply({
				embeds: [
					new ErrorEmbed(t('common:alertMessages.userMissingPermissions', {
						list: missedPermissions.map(permission => '`' + t(`permissions.${permission}`) + '`')
					}))
				]
			})
			return MiddlewareResult.BREAK
		}
	}
	return MiddlewareResult.NEXT
}
