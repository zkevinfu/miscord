import fetchJSON from './fetchJSON.js'

class MapWithFilter extends Map {
  constructor (data) {
    super(data)
  }

  filter (predicate) {
    return new MapWithFilter(Array.from(this.entries()).filter(([ id, entry ], index, array) => predicate(entry, index, array)))
  }

  toArray () {
    return Array.from(this).map(([ , entry ]) => entry)
  }
}

class GuildArray extends Array {
  static from (iter) {
    return super.from(iter).map(data => new Guild(data))
  }

  getChannel (id) {
    const guild = this.find(guild => guild.channels.has(id))
    if (!guild) return null
    return guild.channels.get(id)
  }
}

class Guild {
  constructor (data) {
    this.name = data.name
    this.id = data.id
    this.channels = new MapWithFilter(data.channels.map(channel => [ channel.id, new Channel(channel, this) ]))
  }
}

class Channel {
  constructor (data, guild) {
    this.guild = guild
    this.type = data.type
    this.id = data.id
    this.name = data.name
    this.category = data.category
  }

  get link () {
    return `https://discordapp.com/channels/${this.guild.id}/${this.id}`
  }
}

class Thread {
  constructor (data) {
    this.id = data.id
    this.name = data.name
    this.isGroup = data.isGroup
  }

  get link () {
    return `https://messenger.com/t/${this.id}/`
  }
}

export default {
  async getGuilds () {
    const guilds = await fetchJSON('/discord/channels')
    return GuildArray.from(guilds)
  },
  async getThreads () {
    const threads = await fetchJSON('/messenger/threads')
    return new MapWithFilter(threads.map(thread => [ thread.id, new Thread(thread) ]))
  }
}
