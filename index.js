const Discord = require('discord.js');
const axios = require('axios');
const config = require("./config.json");

const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels.`);
});

client.on("message", async message => {

  console.log(`${message.content}, -${message.author.username}`);

  // if(message.author.bot) return;
  if(message.author === client.user) return;

  /* Global messages */
  if (message.content.toLowerCase().includes('good bot')) {
    message.channel.send(`Thank you ${message.author}`);
  }

  /* Commands */
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  console.log('args:', args);
  console.log('command:', command);

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
  }

  if(command === "makememe") {
    if(args.length === 0) {
      message.channel.send(`Welcome to the memegenerator,
Please supply 3 arguments to this command: Meme to use, Top text & Bottom text.

Example: !makememe 10-Guy Weuw Breauw

Type '!makememe options' to see all the available options.`);
      return;
    } else if(args.length === 2 || args.length > 3 || (args[0] !== 'options' && args.length === 1)) {
      message.channel.send("Please add 3 arguments: Meme, Top text & Bottomtext. Type !makememe for help.");
      return;
    } else if(args[0] === 'options') {

      var memeOptions = [];

      let rl = readline.createInterface({
        input: fs.createReadStream('./memes.txt')
      });

      rl.on('line', (line) => {
        memeOptions.push(line);
      });

      rl.on('close', (line) => {
        var shuffled = shuffleArray(memeOptions);
        message.channel.send(`The list of options is too large to send. So here's 10 random options you could use:

${shuffled.slice(0, 10).join(", ")}`);
        return;
      });

    } else {

      var memeOptions = [];

      let rl = readline.createInterface({
        input: fs.createReadStream('./memes.txt')
      });

      rl.on('line', (line) => {
        memeOptions.push(line);
      });

      rl.on('close', (line) => {
        if(memeOptions.includes(args[0])) {
          message.channel.send(":D", {files: [`http://apimeme.com/meme?meme=${args[0]}&top=${args[1]}&bottom=${args[2]}&test=1.jpg`]})
        } else {
          message.channel.send("I dont know this meme :( Type !makememe options to see all available memes")
        }
      });
    }
  }

  if(command === "insult") {

    if(args.length === 0) {
      message.channel.send("Who should I insult?");
      return;
    } else if(args.length > 1) {
      message.channel.send("Slow down big boy, 1 user at a time");
      return;
    }

    let thinkMessage = await message.channel.send("Thinking of insult....");

    axios.get('https://insult.mattbas.org/api/insult.json')
    .then(function (response) {
      thinkMessage.edit(`${args[0]}, ${response.data.insult.toLowerCase()}`);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  if(command === "pussypic") {
    let waitMessage = await message.channel.send("Getting a dank pussypic..");

    axios.get('http://thecatapi.com/api/images/get?format=xml')
    .then(function (res) {
      waitMessage.delete();
      let json = parser.toJson(res.data);
      let imageUrl = JSON.parse(json).response.data.images.image.url;
      message.channel.send("Here's your dank pussypic..", {files: [imageUrl]})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  if(command === "doggo") {
    let waitMessage = await message.channel.send("Getting a nice doggo");

    axios.get('https://api.thedogapi.co.uk/v2/dog.php')
    .then(function (res) {
      waitMessage.delete(1000);
      let imageUrl =res.data.data[0].url;
      message.channel.send("Here's your dank doggopic..", {files: [imageUrl]})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
});

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

client.login(config.token);
