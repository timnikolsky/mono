import { GuildMember, Message, User } from 'discord.js'
import { TranslatorFunction } from '@typings/index'
import emojis from '../assets/emojis'

export function formatUser(user: User | GuildMember) {
	if(user instanceof GuildMember) user = user.user
	return `${user.toString()} (\`${user.username}#${user.discriminator}\`)`
}

export function formatTimestamp(timestamp: number, style?: 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R') {
	// Convert to format if needed
	if(timestamp.toString().length > 10) timestamp = Math.floor(timestamp / 1000)
	return `<t:${timestamp}${style ? ':' + style : ''}>`
}

export function formatBoolean(t: TranslatorFunction, value: boolean) {
	return `${value ? emojis.switch.on : emojis.switch.off} ${t(`common:${value ? 'yes' : 'no'}`)}`
}

export function formatMessage(t: TranslatorFunction, message: Message) {
	return `[${t('common:messageJump')}](${message.url})`
}
