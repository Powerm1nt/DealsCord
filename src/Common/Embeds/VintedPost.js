const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Events } = require('discord.js')

function generateEmbed (posts, interaction, postIndex, lastPostIndex) {
  const avatar = interaction.client.user.avatarURL()

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(posts[postIndex].title)
    .setURL(posts[postIndex].url)
    .setAuthor({
      name: posts[postIndex].user.login,
      url: posts[postIndex].user.url
    })
    .setThumbnail(posts[postIndex].user.photo.url)
    .setImage(posts[postIndex].photo.full_size_url)
    .addFields(
      { name: 'Price', value: Math.round(posts[postIndex].price * 100) / 100 + '€', inline: false },
      { name: 'Reputation', value: posts[postIndex].favourite_count.toString(), inline: false }
    )
    .setTimestamp()
    .setFooter({ text: interaction.client.user.tag, iconURL: avatar })
  posts[postIndex].size_title >= 1 && embed.addFields({
    name: 'Size',
    value: posts[postIndex].size_title,
    inline: false
  })

  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('prevVintedPost')
        .setLabel('Prev')
        .setStyle('Secondary')
        .setDisabled(postIndex === 0),

      new ButtonBuilder()
        .setCustomId('nextVintedPost')
        .setLabel('Next')
        .setStyle('Primary')
        .setDisabled(postIndex === lastPostIndex)
    )

  console.log(posts[0])

  return { components: [buttons], embeds: [embed] }
}

class VintedPost {
  async makePost (interaction, posts) {
    this.interaction = interaction
    this.posts = posts
    this.postIndex = 0
    this.lastPostIndex = this.posts.length - 1

    interaction.client.on(Events.InteractionCreate, interaction => {
      if (!interaction.isButton()) return
      if (interaction.customId === 'nextVintedPost') {
        this.postIndex++
        interaction.update(generateEmbed(posts, interaction, this.postIndex, this.lastPostIndex))
      }

      if (interaction.customId === 'prevVintedPost') {
        this.postIndex--
        interaction.update(generateEmbed(posts, interaction, this.postIndex, this.lastPostIndex))
      }
    })

    return await interaction.reply(generateEmbed(posts, interaction, this.postIndex, this.lastPostIndex))
  }
}

module.exports = { VintedPost }
