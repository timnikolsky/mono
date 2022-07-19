import MonoGuild from '@base/discord.js/Guild'
import Listener from '@base/Listener'
import Mono from '@base/Mono'
import Console from '@utils/console'
import { ChannelType, OverwriteType } from 'discord-api-types/v10'
import { OverwriteResolvable, VoiceChannel, VoiceState } from 'discord.js'

export default new Listener(
	'voiceStateUpdate',
	async (client: Mono, oldState: VoiceState, newState: VoiceState) => {
		if(!(oldState.guild as MonoGuild).loaded) return

		const privateRoomsModule = (newState.guild as MonoGuild).modules.privateRooms
		if(privateRoomsModule.enabled) {
			try {
				if(!oldState.guild.members.me?.permissions.has(['MoveMembers', 'ManageChannels'])) return
				if(newState.channelId === privateRoomsModule.joinChannelId) {
					const privateRoomPermissionOverwrites: OverwriteResolvable[] = [{
						id: client.user!.id,
						type: OverwriteType.Member,
						allow: ['ViewChannel', 'ManageChannels']
					}, {
						id: newState.member!.user.id,
						type: OverwriteType.Member,
						allow: ['ViewChannel', 'ManageChannels', 'Connect']
					}]

					if(privateRoomsModule.defaults.hidden) {
						privateRoomPermissionOverwrites.push({
							id: newState.guild.roles.everyone.id,
							type: OverwriteType.Role,
							deny: ['ViewChannel']
						})
					}

					if(privateRoomsModule.defaults.locked) {
						privateRoomPermissionOverwrites.push({
							id: newState.guild.roles.everyone.id,
							type: OverwriteType.Role,
							deny: ['Connect']
						})
					}

					const roomName = privateRoomsModule.defaults.name
						.replace('{{username}}', newState.member!.user.username)
						.replace('{{nickname}}', newState.member!.displayName)
						.replace('{{userId}}', newState.member!.user.id)

					const privateRoomCreated = await newState.guild.channels.create(
						roomName,
						{
							type: ChannelType.GuildVoice,
							parent: newState.channel?.parent ?? undefined,
							permissionOverwrites: privateRoomPermissionOverwrites,
							userLimit: privateRoomsModule.defaults.limit
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
							member => !member.user.bot
						))!.size
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
