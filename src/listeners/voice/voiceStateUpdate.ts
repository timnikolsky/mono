import Listener from '@base/Listener'
import Mono from '@base/Mono'
import { Collection, OverwriteResolvable, VoiceState } from 'discord.js'
import MonoGuild from '@base/discord.js/Guild'
import Console from '@utils/console'
import chalk from 'chalk'

export default new Listener(
	'voiceStateUpdate',
	async (client: Mono, oldState: VoiceState, newState: VoiceState) => {
		if(!(oldState.guild as MonoGuild).loaded) return

		const privateRoomsModule = (newState.guild as MonoGuild).modules.privateRooms
		if(privateRoomsModule.enabled) {
			try {
				if(!oldState.guild.me?.permissions.has(['MOVE_MEMBERS', 'MANAGE_CHANNELS'])) return
				if(newState.channelId === privateRoomsModule.joinChannelId) {
					const privateRoomPermissionOverwrites: OverwriteResolvable[] = [{
						id: client.user!.id,
						type: 'member',
						allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS']
					}, {
						id: newState.member!.user.id,
						type: 'member',
						allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
					}]

					if(privateRoomsModule.defaults.hidden) {
						privateRoomPermissionOverwrites.push({
							id: newState.guild.roles.everyone.id,
							type: 'role',
							deny: ['VIEW_CHANNEL']
						})
					}

					if(privateRoomsModule.defaults.locked) {
						privateRoomPermissionOverwrites.push({
							id: newState.guild.roles.everyone.id,
							type: 'role',
							deny: ['CONNECT']
						})
					}

					const roomName = privateRoomsModule.defaults.name
						.replace('{{username}}', newState.member!.user.username)
						.replace('{{nickname}}', newState.member!.displayName)
						.replace('{{userId}}', newState.member!.user.id)

					const privateRoomCreated = await newState.guild.channels.create(
						roomName,
						{
							type: 'GUILD_VOICE',
							parent: newState.channel?.parent || undefined,
							position: newState.channel?.calculatedPosition! + 1,
							permissionOverwrites: privateRoomPermissionOverwrites
						}
					)
					await newState.setChannel(privateRoomCreated)
					await client.database.activePrivateRoom.create({
						data: {
							channelId: privateRoomCreated.id,
							hostId: newState.member!.user.id
						}
					})
				}
				if(oldState.channelId !== newState.channelId && oldState.channelId) {
					const activePrivateRoom = await client.database.activePrivateRoom.findFirst({
						where: {
							channelId: oldState.channelId
						}
					})
					// If no human-users left in private room
					if(
						activePrivateRoom
						&& !(oldState.channel?.members.filter(
							member => !member.user.bot,
							{ return: 'collection' }
						) as unknown as Collection).size
					) {
						await oldState.channel?.delete()
						await client.database.activePrivateRoom.delete({
							where: {
								channelId: oldState.channelId
							}
						})
					}
				}
			} catch(e) {
				Console.error(`Error while trying to manage private rooms in guild '${oldState.guild.name}'`)
				console.log(e)
			}
		}
	}
)
