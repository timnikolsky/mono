import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { Collection, MessageReaction, User } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'
import { ReactionRolesMessageMode } from '../../enums'

export default new Listener(
	'messageReactionAdd',
	async (client: Mono, messageReaction: MessageReaction, user: User) => {

		// Reaction Roles
		if((messageReaction.message.guild as MonoGuild).modules.roles.enabled) {
			const reactionRole = await client.database.reactionRole.findFirst({
				where: {
					emoji: messageReaction.emoji.id || messageReaction.emoji.name!,
					messageId: messageReaction.message.id
				},
				include: {
					message: {
						include: {
							reactionRoles: true
						}
					}
				}
			})

			if(reactionRole) {
				const member = await messageReaction.message.guild!.members.fetch(user.id)
				await messageReaction.message.fetch()
				switch(reactionRole.message.mode) {
					case ReactionRolesMessageMode.STANDARD:
						await member.roles.add(reactionRole.roleId)
						break
					case ReactionRolesMessageMode.UNIQUE:
						reactionRole.message.reactionRoles.filter(rr => rr.roleId !== reactionRole.roleId).forEach(rr => {
							if(member.roles.cache.has(rr.roleId)) member.roles.remove(rr.roleId)
						})
						reactionRole.message.reactionRoles.filter(rr => rr.emoji !== reactionRole.emoji).forEach(rr => {

						})
						// TODO: clean code
						await (messageReaction.message.reactions.cache.filter(r => ![r.emoji.name, r.emoji.id].some(e => e === reactionRole.emoji), { return: 'collection' }) as unknown as Collection).forEach((r: MessageReaction) => r.users.remove(user))
						await member.roles.add(reactionRole.roleId)
						break
					case ReactionRolesMessageMode.ADD_ONLY:
						await member.roles.add(reactionRole.roleId)
						break
					case ReactionRolesMessageMode.REMOVE_ONLY:
						await member.roles.remove(reactionRole.roleId)
						break
				}
			}
		}
	}
)
