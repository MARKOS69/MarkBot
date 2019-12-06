module.exports = client => {
  require('moment-duration-format')
  const ms = require('ms')
  const pms = require('pretty-ms')
  const { Util } = require('discord.js')
  const Youtube = require('simple-youtube-api')

  client.youtube = new Youtube('AIzaSyArOHhck-PsbRgoNqX3QrDjSsgHRPPiPsI')
  client.queue = new Map()
  client.ytdl = require('ytdl-core-discord')

  client.handleVideo = async (video, msg, voiceChannel, playlist = false) => {
    const serverQueue = client.queue.get(msg.guild.id)
    const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`,
      requestedBy: msg.author,
      duration: ms(`${video.durationSeconds} seconds`)
    }
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        msg: msg,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        looping: false
      }
      client.queue.set(msg.guild.id, queueConstruct)
      queueConstruct.songs.push(song)
      try {
        var connection = await voiceChannel.join()
        queueConstruct.connection = connection
        client.playMusic(msg.guild, queueConstruct.songs[0])
      } catch (err) {
        client.queue.delete(msg.guild.id)
        return client.sendError(msg, `I could not join the voice channel:\n${err}`)
      }
    } else {
      serverQueue.songs.push(song)
      if (playlist) return undefined
      else return msg.channel.send(`**${song.title}** has been added to the queue.`)
    }
    return undefined
  }

  client.playMusic = async (guild, song) => {
    let npMsg
    const serverQueue = client.queue.get(guild.id)
    if (!song) {
      serverQueue.voiceChannel.leave()
      serverQueue.msg.channel.send('>>> :stop_button: Queue has ended.')
      client.queue.delete(guild.id)
      return
    }
    try {
      const dispatcher = serverQueue.connection.playOpusStream(await client.ytdl(song.url))
        .on('end', reason => {
          if (serverQueue.npMsg) serverQueue.npMsg.delete()
          if (!serverQueue.looping) serverQueue.songs.shift()
          client.playMusic(guild, serverQueue.songs[0])
        })
        .on('error', error => {
          client.log.error(error)
        })
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
    } catch (err) {
      client.log.error(err)
      client.sendError(serverQueue.msg, `There was an error playing that song:\n\`${err}\`\nSkipping to the next song...`)
      serverQueue.songs.shift()
      if (serverQueue.npMsg) serverQueue.npMsg.delete()
      if (npMsg) {
        npMsg.delete()
      }
      return client.playMusic(guild, serverQueue.songs[0])
    }
    if (npMsg) {
      npMsg.delete()
    }
    serverQueue.npMsg = await serverQueue.textChannel.send({
      embed: {
        title: '🎶 Now Playing 🎶',
        description: `**[${song.title}](${song.url})**\n\n*Duration:* ${pms(song.duration, { long: true })}${serverQueue.looping ? '\n:repeat_one: *Looping*' : ''}`,
        thumbnail: {
          url: `https://img.youtube.com/vi/${song.id}/0.jpg`
        },
        footer: {
          text: `Requested by ${guild.members.get(song.requestedBy.id).displayName}`,
          icon_url: song.requestedBy.avatarURL
        },
        color: serverQueue.msg.embedColor
      }
    })
  }
}
