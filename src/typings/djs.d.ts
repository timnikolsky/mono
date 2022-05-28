import 'discord.js'
import MonoGuild from '@base/discord.js/Guild'

declare module 'discord.js' {
	class Guild extends MonoGuild {}
}
