const { REST, Routes } = require('discord.js')
require('dotenv').config()
const fs = require('fs')
const { CLIENT_ID, TOKEN } = process.env
const path = require('node:path')

const commands = []
// Grab all the command files from the commands directory you created earlier
const commandsDirectory = path.resolve(__dirname, 'Common/Commands')
const commandFiles = fs.readdirSync(commandsDirectory).filter(file => file.endsWith('.js'))

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const filePath = path.resolve(commandsDirectory, file)

  // Validate file path to ensure it's within the allowed directory
  if (filePath.startsWith(commandsDirectory)) {
    const command = require(filePath)
    commands.push(command.data.toJSON())
  } else {
    console.warn(`Skipping file ${filePath} as it's not within the allowed directory.`)
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN)

// and deploy your commands!
async function deployCommands () {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    )

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
}

module.exports = { deployCommands }
