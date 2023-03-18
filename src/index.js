const { ConfigProvider } = require('./Common/ConfigProvider')
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const { Sequelize } = require('sequelize')
const Alert = require('./Common/DataModels/Alert')

const config = new ConfigProvider()
if (!config.has('token')) config.set('token', '<INSERT TOKEN HERE>') && config.save()
if (!config.has('guildId')) config.set('guildId', '<INSERT GUILD ID HERE>') && config.save()
if (!config.has('clientId')) config.set('clientId', '<INSERT CLIENT ID HERE>') && config.save()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

// Register Commands
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'Common/Commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

// Sqlite Database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db'
})

// Init the Database
async function initDb () {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }

  try {
    await sequelize.sync()
    console.log('Database synced successfully.')
  } catch (error) {
    console.error('Unable to sync the database:', error)
    process.exit(1)
  }
}

initDb().then(async () => {
  await client.login(config.get('token'))
})

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${chalk.white.bold(client.user.tag)}!`)
})
