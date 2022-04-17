import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { MessageReaction, User } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'
import { ReactionRolesMessageMode } from '../../enums'

export default new Listener(
	'messageReactionRemove',
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
						await member.roles.remove(reactionRole.roleId)
						break
					case ReactionRolesMessageMode.UNIQUE:
						await member.roles.remove(reactionRole.roleId)
						break
					case ReactionRolesMessageMode.ADD_ONLY:
						break
					case ReactionRolesMessageMode.REMOVE_ONLY:
						break
				}
			}
		}

		// if(user.bot) return
		// const message = messageReaction.message
		// if(message.partial) await message.fetch()
		//
		// const guild = message.guild as MonoGuild
		// if(!guild) return
		//
		// if(!message.member) await guild.members.fetch(message.author?.id || '')
		//
		// const { starboard: starboardConfig } = await guild.modules
		// if(!starboardConfig.enabled) return
		//
		// if(messageReaction.emoji.name === starboardConfig.emojiId || messageReaction.emoji.name === starboardConfig.emojiId) {
		// 	const reactionCount = message.reactions.cache.get(messageReaction.emoji.name || '')?.count || 1
		//
		// 	if(reactionCount >= 1) {
		// 		await (client.channels.cache.get('910608998464634881') as TextChannel).send({
		// 			embeds: [
		// 				new MessageEmbed({
		// 					description: message.content + `\n\n${reactionCount} ⭐ › [Jump to message](${message.url})`,
		// 					author: {
		// 						name: message.member?.displayName || 'null',
		// 						iconURL: message.author?.displayAvatarURL()
		// 					}
		// 				})
		// 			]
		// 		})
		// 	}
		// }
	}
)
