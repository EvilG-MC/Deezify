# Deezify - Discord Bot

## About Deezify

Deezify is a Discord Music Bot that use Deezer API to search and play music

**`⚠️` Deezify is still under development**

## Made With

Deezify has been made with these technologies:

- `👾` [Using Oceanic.js](https://docs.oceanic.ws)
- `🔊` [Playing music with @discordjs/voice](https://old.discordjs.dev/#/docs/voice/main/general/welcome)
- `📘` [Written in TypeScript](https://www.typescriptlang.org)

## Available commands

Deezify is still under development, we are working to create more commands!

```
dzplay [song]: Plays a song in a voice channel
```

<hr />

# Installation and Usage

## Installation

To install all the dependencies, you can use `npm i`

## API

To play a song, you will need to use our custom API to be able to play songs with the bot **([Support Server](https://discord.com/invite/q2kvcJPmqr))**

**`⚠️` The API downloads the track from Deezer, then decrypts it and return a MP3 file (This may violate the Terms of Service from Deezer, so use as your own risk)**

## File .env

You need to create a `.env` file with these settings

```
Token = BOT_TOKEN
API = API_URL
APIBearer = API_AUTH
```

## Execute

- **`🟢` npm run start**: Start the bot
- **`🖥️` npm run dev**: Start the bot in development mode
- **`🏢` npm run prod**: Start the bot in production mode **(You need to execute build command before use this)**
- **`🚧` npm run build**: Compile the TypeScript code to JavaScript
