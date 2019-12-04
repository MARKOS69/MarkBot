const Discord = require("discord.js");
const fs = require("fs");
const botconfig = require("./botconfig.json");
const got = require('got');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const Client = new Discord.Client();
require('./music.js')(Client);

const token = 'Bot token';

const PREFIX = '~';


Client.on('ready', () => {
    console.log('Bot is online!');
    Client.user.setPresence({ status: 'idle' })

    let act = 0
    Client.setInterval(() => {
        // everytime the loop executes, we count up 1 and reset back to 1 once we hit 4
        act++
        let type
        let stat
        if (act === 4) {
        act = 1
        };
        // select statuses with our counting variable
        switch (act) {
        case 1:
            stat = `${Client.guilds.size} servers! | ~help`
            type = 'WATCHING'
            break
        case 2:
            stat = `with ${Client.users.size} users! | ~help`
            type = 'PLAYING'
            break
        case 3:
            stat = `${Client.channels.filter(t => t.type === 'text').size} channels! | ~help`
            type = 'LISTENING'
        };
        // Set the status of the bot to the selected status
        Client.user.setActivity(`${stat}`, {
        type: `${type}`
        })
    }, 15000)
});

Client.on('warn', console.warn);

Client.on('error', console.error);

Client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

Client.on('reconnecting', () => console.log('I am reconnecting now!'));



Client.on("message", async message => {

    if (message.author.bot) return undefined;

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        };
    }

      let prefix = prefixes[message.guild.id].prefixes;

    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    if(command === 'help') {

        const embed = new Discord.RichEmbed()
        .setAuthor('MarkBot')
        .setColor("RANDOM")
        .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3B37XMxUk7I3hmBQh9QVKUS5JLQuFnRvI8gGMvZuRROcXuZ_zSQ")
        .setDescription('*Prefix is ~*\n\n ~help\n For the commands\n\n ~helpmod\n I will show the Moderator commands!\n\n ~ping\n I will answer with :ping_pong: and your ms and my ms!!\n\n ~helpmeme\n For all the meme commands!\n\n ~helpanime\n For all of the anime commands!\n\n~helpnsfw\n To view this command you will need to turn on the NSFW or be in a NSFW channel!\n\n~lyric\n Will show the song that the bot have!\n\n~helpfun\n To show the fun commands!\n\n~helpmusic\n To see music commands!');
        embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
        message.channel.send(embed);

        }

        if(command === "ping") {
            let embed = new Discord.RichEmbed() 
                 .setColor('RANDOM')
                 .setTitle(`Loading...`)
                 .setTimestamp()
         
             message.channel.send(embed).then(message => {
                 embed.setColor('RANDOM')
                 embed.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/table-tennis-paddle-and-ball_1f3d3.png")
                 embed.setTitle(':ping_pong: Pong!')
                 embed.setDescription(`Your Latency: ${Client.pings[0]}ms\nBot Latency: ${Math.floor((Math.random() * 50) + 20)}.${Math.floor((Math.random() * 10) + 0)}ms`)
                 embed.setFooter(`MarkBot 2019`, message.author.avatarURL)
                 embed.setTimestamp()
         
                 message.edit(embed)
            })
         
        }

        if (command === 'meme') {
            got('https://www.reddit.com/r/dankmemes/random/.json').then(response => {
                let content = JSON.parse(response.body);
                var image = content[0].data.children[0].data.url;
    
                    const embed = new Discord.RichEmbed()
                .setTitle('FUNNY MEME BOOM!')
                .setAuthor('MarkBot')
                .setColor("RANDOM")
                .setDescription(content[0].data.children[0].data.title)
                .setImage(image)
                embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                message.channel.send({embed: embed});
            });
        }

    if (command === 'animememe') {
        got('https://www.reddit.com/r/animememes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            var image = content[0].data.children[0].data.url;

                const embed = new Discord.RichEmbed()
            .setTitle(content[0].data.children[0].data.title)
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setDescription('Funny Anime MEME BOOM!')
            .setImage(image)
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
            message.channel.send({embed: embed});
        });
    }

    if (command === 'animegirl') {
      got('https://www.reddit.com/r/AnimeGirls/random/.json').then(response => {
          let content = JSON.parse(response.body);
          var image = content[0].data.children[0].data.url;

              const embed = new Discord.RichEmbed()
          .setAuthor('MarkBot')
          .setColor("RANDOM")
          .setDescription('Cute anime girl! ;D')
          .setImage(image)
          embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
           message.channel.send({embed: embed});
      });
  }

    if (command === 'helpmeme') {

        const embed = new Discord.RichEmbed()
        .setAuthor('MarkBot')
        .setColor("RANDOM")
        .setThumbnail("https://i.kym-cdn.com/photos/images/original/001/170/740/aea.png")
        .setDescription('~meme\n I will post meme!\n\n ~animememe\n I will post an anime meme!\n\n ~minecraftmeme\n I will post a minecraft meme!:D\n\n ~cocmeme\n I will posted a Clash of Clans meme!')
        embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
        message.channel.send(embed);
    }

    if (command === 'minecraftmeme') {

        got('https://www.reddit.com/r/MinecraftMemes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            var image = content[0].data.children[0].data.url;

                const embed = new Discord.RichEmbed()
            .setTitle(content[0].data.children[0].data.title)
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setDescription('Minecraft MEME BOOM!:D')
            .setImage(image)
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
             message.channel.send({embed: embed});
        });
    }

    if(command === "8ball") {
        let question = args.slice(0).join(' ');
    if (!question)
    return message.channel.send({embed: {
  
            color: 15158332,
  
            description: "Please ask a question!"}});
    if (!message.content.includes(""))
    return message.channel.send({embed: {
  
            color: 15158332,
  
            description: "You didnt ask a question!"}});
          var sayings = [ 'Absolutly.',
                          'Absolutly not.',
                          'It is true.',
                          'Impossible.',
                          'Of course.',
                          'I do not think so.',
                          'It is true.',
                          'It is not true.',
                          'I am very undoubtful of that.',
                          'I am very doubtful of that.',
                          'Sources point to no.',
                          'Theories prove it.',
                          'Reply hazy try again.',
                          'Ask again later.',
                          'Better not tell you now.',
                          'Cannot predict now.',
                          'Concentrate and ask again.',
                          'You may rely on it. ',
                          'Yes. ',
                          'No. ',
                          'Could be.',
                          'Ask a different question.',
                          'I dont have an answer for that.',
                          'Maybe you ask others,not me.',
                          'Of course no.',
                          'I dont have an answer for that.',
                          'Im not a big-brained maniac to answer that question.'
              ];
      
      
              var result = Math.floor((Math.random() * sayings.length) + 0);
        let userembed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/110/billiards_1f3b1.png")
    .addField(`${message.author.username} asks:`, question)
    .addField(`The Magic:8ball: said:`, sayings[result])
    .setFooter(`MarkBot 2019`, message.author.avatarURL)
    .setTimestamp()
    
    message.channel.send(userembed);
  }
        if (command === 'nekonsfw') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/Nekomimi/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                            const embed = new Discord.RichEmbed()
                    .setTitle(content[0].data.children[0].data.title)
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('Naked anime neko girl!')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        }    

        if (command === 'helpanime') {

            const embed = new Discord.RichEmbed()
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setThumbnail("https://styles.redditmedia.com/t5_2qh22/styles/communityIcon_gysvz8jisp621.png")
            .setDescription('~animegirl ==> for a cute anime girl OwO!\n\n ~animegif ==> for a cool anime gif!\n\n ~animeglare ==> for the best anime app!')
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
            message.channel.send(embed);
        }

        if(command === "clear") {
            const deleteCount = parseInt(args[0], 10);
        
            if(!deleteCount  ||deleteCount < 2||  deleteCount > 100)
              return message.reply("Please input a valid number to delete  :japanese_goblin::poop::sleeping::japanese_ogre:");
        
            const fetched = await message.channel.fetchMessages({limit: deleteCount});
            message.channel.bulkDelete(fetched)
              .catch(error => message.reply(`Couldnt delete messages because of: ${error}`));
          }

          if(command === "report") {
            let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
            if(!rUser) return message.channel.send("Couldn't find that user.");
            let rreason = args.join(" ").slice(22);
            if(!rreason) return message.channel.send("Please provide a reason to report");
        
            let reportEmbed = new Discord.RichEmbed()
            .setDescription("Reports")
            .setColor('RANDOM')
            .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
            .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
            .addField("Channel", message.channel)
            .addField("Time", message.createdAt)
            .addField("Reason", rreason);
        
            let reportschannel = message.guild.channels.find(`name`, "mod-logs");
            if(!reportschannel) return message.channel.send("Couldn't find reports channel.");
        
        
            reportschannel.send(reportEmbed);
        
        }

        if(command === "warn") {
            var embedColor = 'RANDOM' 
          
              var missingPermissionsEmbed = new Discord.RichEmbed() 
                  .setColor(embedColor)
                  .setAuthor(message.author.username, message.author.avatarURL)
                  .setTitle('Insufficient Permissions!')
                  .setDescription('You dont have permission to use this command!')
                  .setTimestamp();
              var missingArgsEmbed = new Discord.RichEmbed() 
                  .setColor(embedColor)
                  .setAuthor(message.author.username, message.author.avatarURL)
                  .setTitle('Missing Arguments!')
                  .setDescription(`Usage: warn [@User] [Reason]`)
                  .setTimestamp();
              if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionsEmbed); 
              let mentioned = message.mentions.users.first(); 
              if(!mentioned) return message.channel.send(missingArgsEmbed); 
              let reason = args.slice(1).join(' ') 
              if(!reason) return message.channel.send(missingArgsEmbed);
              
              var warningEmbed = new Discord.RichEmbed() 
                  .setColor(embedColor)
                  .setAuthor(message.author.username, message.author.avatarURL)
                  .setTitle('You have been warned in ${message.guild.name}')
                  .addField('Warned by ${message.author.tag}')
                  .addField("Reason", reason)
                  .setTimestamp();
              mentioned.send(warningEmbed); 
              var warnSuccessfulEmbed = new Discord.RichEmbed() 
                  .setColor(embedColor)
                  .setTitle('User Successfully Warned!');
              message.channel.send(warnSuccessfulEmbed); 
            }

            if(command === "kick") {
                if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You dont have perms!");
            
                let member = message.mentions.members.first() || message.guild.members.get(args[0]);
                if(!member)
                  return message.reply("Please mention a valid member of this server");
                if(!member.kickable) 
                  return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
            
                let reason = args.slice(1).join(' ');
                if(!reason) reason = "No reason provided";
            
                await member.kick(reason)
                  .catch(error => message.reply(`Sorry ${message.author} I couldnt kick because of : ${error}`));
                message.channel.send({embed: {
            
               color: 3447003,
               title: `User Kicked:ballot_box_with_check:`
            , 
               description: `Kicked member:\n${member.user.tag}\n\nKicked by:\n${message.author.tag}\n\nReason:\n${reason}`}});
              }
            
            if(command === "ban") {
                if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You dont have perms!");
            
                let member = message.mentions.members.first();
                if(!member)
                  return message.reply("Please mention a valid member of this server");
                if(!member.bannable) 
                  return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
            
                let reason = args.slice(1).join(' ');
                if(!reason) reason = "No reason provided";
            
                await member.ban(reason)
                  .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
                message.channel.send({embed: {
            
               color: 3447003,
            
               title: `User banned:white_check_mark:`,
               description: `Banned member:\n${member.user.tag}\n\nBanned by:\n${message.author.tag}\n\nReason:\n${reason}`}});
              }

              if (command === 'helpmod') {

                const embed = new Discord.RichEmbed()
                .setAuthor('MarkBot')
                .setColor("RANDOM")
                .setThumbnail("https://pbs.twimg.com/profile_images/442654006142173184/04Oc3A8Y_400x400.jpeg")
                .setDescription('~warn\n I will warn someone you tell me\n\n ~ban\n I dont thing i need to say anything but anyway i will ban someone you tell me\n\n ~kick\n i will kick someone you tell me\n\n ~report\n i will report someone you tell me\n\n ~clear\n Enter a number to clear.')
                embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                message.channel.send(embed);
            }

            if (command === 'helpnsfw') {
                if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                    const nsfwError = new Discord.RichEmbed()
                    .setDescription('You can only use this command on an NSFW channel.')
                    .setColor("RANDOM");
                                return message.channel.send(nsfwError);
                    };
                
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setThumbnail("https://cdn-images-1.medium.com/max/800/0*auWeZYXZjFkr33e6")
                    .setDescription('**NSFW STUFF!** :drooling_face:\n\n ~nekonsfw ==> I will show a photo of a neked anime neko girl! :drooling_face:\n\n ~animensfw ==> I will show a photo of a naked anime girl! :drooling_face:\n\n ~boobs ==> I will posted a photo with boobs!:drooling_face:\n\n ~ass ==> I will posted a photo with ass!:drooling_face:\n\n ~hentaibomb ==> I will posted 5 photos of anime girls!:drooling_face:')
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send(embed);
            }
            
            if (command === 'animensfw') {
                if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                    const nsfwError = new Discord.RichEmbed()
                    .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                    .setColor("RANDOM");
                                return message.channel.send(nsfwError);
                    };
            
                        got('https://www.reddit.com/r/LewdAnimeGirls/random/.json').then(response => {
                            let content = JSON.parse(response.body);
                            var image = content[0].data.children[0].data.url;
                
                        const embed = new Discord.RichEmbed()
                        .setAuthor('MarkBot')
                        .setColor("RANDOM")
                        .setDescription('Naked anime girl!:drooling_face:')
                        .setImage(image)
                        embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                        message.channel.send({embed: embed});
            
                });
            } 
            
            if (command === 'animegif') {

                got('https://www.reddit.com/r/animegifs/random/.json').then(response => {
                    let content = JSON.parse(response.body);
                    var image = content[0].data.children[0].data.url;
        
                        const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription(`Cool anime gif!<a:nezukoBored:602424558489960448>\n[Click me if it doesn't load](${image})`)
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                     message.channel.send({embed: embed});
                });
            }

	    if (command === 'prefix') {
		if(!message.member.hasPermission("SEND_MESSAGES")) return message.channel.send("You do not have permissions!");
           	if(!args[0] || args[0 == "help"]) return message.reply("Use like so: $prefix <prefix>");
          
            let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
          
            prefixes[message.guild.id] = {
              prefixes: args[0]
            };
          
            fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
              if (err) console.log(err)
            });
          
            const embed = new Discord.RichEmbed()
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setTimestamp()
            .setDescription(`New Prefix is now (${args[0]})`);
            message.channel.send(embed);
	    }

        if (command === 'creeper') {

        const embed = new Discord.RichEmbed()
        .setAuthor('MarkBot')
        .setColor("RANDOM")
        .setThumbnail("https://i.redd.it/msa7dcndhhj21.png")
        .setDescription('Creeper\nAw man\n\nSo we back in the mine\nGot our pickaxe swinging from side to side\nSide-side to side\nThis task, a grueling one\nHope to find some diamonds tonight, night, night\nDiamonds tonight\n\nHeads up\nYou hear a sound, turn around and look up\nTotal shock fills your body\nOh no, its you again\nI can never forget those eyes, eyes, eyes\nEyes-eyes-eyes :eyes::eyes::eyes:\n\nCause, baby, tonight\nThe creepers trying to steal all our stuff again\nCause, baby, tonight\nGrab your pick, shovel, and bolt again (Bolt again-gain)\nAnd run, run until its done, done\nUntil the sun comes up in the morn\nCause, baby, tonight\nThe creepers trying to steal all our stuff again (Stuff again-gain)\n\nJust when you think you are safe\nOverhear some hissing from right behind\nRight-right behind\nThat is a nice life you have\nShame its gotta end at this time, time, time\nTime-time-time-time\n\nBlows up\nThen your health bar drops and you could use a one-up\nGet inside, dont be tardy\nSo now you are stuck in there')
        embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL);
        message.channel.send(embed);

        }

        if (command === 'creeper') {

            const embed = new Discord.RichEmbed()
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setThumbnail("https://i.redd.it/msa7dcndhhj21.png")
            .setDescription('Half a heart is left, but dont die, die, die\nDie-die-die\n\nCause, baby, tonight\nThe creepers trying to steal all our stuff again\nCause, baby, tonight\nGrab your pick, shovel, and bolt again (Bolt again-gain)\nAnd run, run until it is done, done\nUntil the sun comes up in the morn\nCause, baby, tonight\nThe creepers trying to steal all our stuff again\n\nCreepers, you are mine, haha\nDig up diamonds,\nAnd craft those diamonds,\nAnd make some armor,\nGet it, baby, go and forge that like you so MLG pro\nThe swords made of diamonds, so come at me bro\nHuh? Training in your room under the torchlight\nHone that form to get you ready for the big fight\nEvery single day and the whole night\nCreepers out prowlin, woo, alright\nLook at me, look at you\nTake my revenge, that is what I am gonna do\nI am a warrior, baby, what else is new?\nAnd my blade is gonna tear through you, bring it\n\nCause, baby, tonight\nThe creepers trying to steal all our stuff again\n(Gather your stuff, yeah, let is take back the world, haha)\nYeah, baby, tonight grab your sword, armor and go (It is on)\nTake your revenge (Woo), oh-oh-oh-oh\nSo fight, fight, like it is the last, last night of your life, life\nShow them your bite (Woo)\n\nCause, baby, tonight\nThe creepers trying to steal all our stuff again\nCause, baby, tonight\nGrab your pick, shovel and bolt again (Bolt again-gain, woo)\nAnd run, run until it is done, done\nUntil the sun comes up in the morn\nCause, baby, tonight (Come on, swing your sword up high)\nThe creepers trying to steal all our stuff again (Come on, jab your sword down low)\n(Woo)')
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL);
            message.channel.send(embed);
    
        }

        if(command === 'creeper') {

            const embed = new Discord.RichEmbed()
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setThumbnail("https://i.redd.it/msa7dcndhhj21.png")
            .setDescription('Music video!\nhttps://youtu.be/cPJUBQd-PNM');
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
            message.channel.send(embed);
    
        }

        if(command === 'lyric') {

            const embed = new Discord.RichEmbed()
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3B37XMxUk7I3hmBQh9QVKUS5JLQuFnRvI8gGMvZuRROcXuZ_zSQ")
            .setDescription('The lyric commands\n\n\~creeper\nShows the song\n"Revenge" - A Minecraft Parody of Ushers DJ Got Us Fallin In Love (Music Video)\nBy CaptainSparklez\n\nMore to come!');
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
            message.channel.send(embed);
    
        }

        if (command === 'boobs') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/boobs/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('BOOBS! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'ass') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/ass/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('ASS! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'hentaibomb') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/LewdAnimeGirls/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('Hentai BOMB! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'hentaibomb') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/Nekomimi/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('Hentai BOMB! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'hentaibomb') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/LewdAnimeGirls/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('Hentai BOMB! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'hentaibomb') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/Nekomimi/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('Hentai BOMB! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'hentaibomb') {
            if (message.channel.type === 'text' && message.channel.nsfw !== true) {
                const nsfwError = new Discord.RichEmbed()
                .setDescription('I mean if you know that command then why are you here LOL!\n You will need to be in NSFW channel.')
                .setColor("RANDOM");
                            return message.channel.send(nsfwError);
                };
        
                    got('https://www.reddit.com/r/LewdAnimeGirls/random/.json').then(response => {
                        let content = JSON.parse(response.body);
                        var image = content[0].data.children[0].data.url;
            
                    const embed = new Discord.RichEmbed()
                    .setAuthor('MarkBot')
                    .setColor("RANDOM")
                    .setDescription('Hentai BOMB! :drooling_face:')
                    .setImage(image)
                    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                    message.channel.send({embed: embed});
        
            });
        } 

        if (command === 'cocmeme') {

            got('https://www.reddit.com/r/ClashOfClans/random/.json').then(response => {
                let content = JSON.parse(response.body);
                var image = content[0].data.children[0].data.url;
    
                    const embed = new Discord.RichEmbed()
                .setTitle(content[0].data.children[0].data.title)
                .setAuthor('MarkBot')
                .setColor("RANDOM")
                .setDescription('Clash of Clans MEME BOOM!:D')
                .setImage(image)
                embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
                 message.channel.send({embed: embed});
            });
        }

        if(command === "avatar") {
            let user;
          
              if (message.mentions.users.first()) {
                   user = message.mentions.users.first();
              } else {
                   user = message.author;
               }
          
               const member = message.guild.member(user);
          
               const embed = new Discord.RichEmbed() 
                  .setTitle(`${user.username}'s avatar`)
                  .setColor("RANDOM")
                  .setImage(user.avatarURL)
                  .setTimestamp()
                  embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
          
              message.channel.send(embed)
          
            }

        if (command === 'helpfun') {

            const embed = new Discord.RichEmbed()
            .setAuthor('MarkBot')
            .setColor("RANDOM")
            .setThumbnail("https://pbs.twimg.com/profile_images/583641266979647488/ZiQhABjl.jpg")
            .setDescription('~8ball\n Ask the magic 8ball anything\n\n~avatar\n Shows your/someones profile pic.\n\n~userinfo\n Shows your/someones user info.\n\n~say\n I will repeat what you said.')
            embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
            message.channel.send(embed);
        }

        if (command === 'say') {
            const sendmessage = args.join(' ')
          const channelObject = message.channel
          if (!channelObject) {
            message.channel.send('Invalid channel')
            return
          }
          if (!sendmessage) {
            message.channel.send('You need to enter a message to send')
            return
          }
          message.delete()
          channelObject.send(sendmessage)
        }

        if (command === 'userinfo') {

            function getUserFromMention (mention) {
                  if (!mention) return
            
                  if (mention.startsWith('<@') && mention.endsWith('>')) {
                    mention = mention.slice(2, -1)
            
                    if (mention.startsWith('!')) {
                      mention = mention.slice(1)
                    }
                  }
            
                  return message.guild.members.get(mention)
                }
                let target = ''
                if (args[0]) {
                  target = getUserFromMention(args[0])
                  if (!target) {
                    return message.channel.send('Invalid user, they either do not exist or are not in this guild.')
                  }
                } else {
                  const userid = message.author.id
                  target = message.guild.members.get(userid)
                };
                const perms = target.permissions.toArray()
                let ePerms = []
                if (perms.includes('ADMINISTRATOR')) {
                  ePerms = ['*Administrator*']
                  if (target.id === message.guild.ownerID) {
                    ePerms = ['*Guild Owner*']
                  }
                } else {
                  perms.forEach(p => {
                    switch (p) {
                      case 'MANAGE_ROLES':
                        ePerms.push('Manage Roles')
                        break
                      case 'KICK_MEMBERS':
                        ePerms.push('Kick Members')
                        break
                      case 'BAN_MEMBERS':
                        ePerms.push('Ban Members')
                        break
                      case 'MANAGE_CHANNELS':
                        ePerms.push('Manage Channels')
                        break
                      case 'MANAGE_MESSAGES':
                        ePerms.push('Manage Messages')
                        break
                      case 'MANAGE_WEBHOOKS':
                        ePerms.push('Manage Webhooks')
                        break
                      case 'MANAGE_EMOJIS':
                        ePerms.push('Manage Emojis')
                        break
                      case 'MANAGE_GUILD':
                        ePerms.push('Manage Server')
                    };
                  })
                };
                const memberRoles = target.roles.filter(r => r.name !== '@everyone')
                let mapRoles = memberRoles.map(r => '<@&' + r.id + '>').join(', ')
                if (!mapRoles) {
                  mapRoles = 'No Roles'
                };
                message.channel.send({ embed: {
                  title: `Info about ${target.displayName}`,
                  color: message.embedColor,
                  thumbnail: {
                    url: target.user.displayAvatarURL
                  },
                  timestamp: new Date(),
                  fields: [{
                    name: 'Identity',
                    value: `Full Username: \`${target.user.tag}\`\nID: \`${target.user.id}\`\nNickname in Guild: \`${target.nickname || 'Not set'}\``,
                    inline: false
                  }, {
                    name: 'All Roles',
                    value: mapRoles,
                    inline: true
                  }, {
                    name: 'Role Info',
                    value: `Highest Role: ${target.highestRole || 'N/A'}\nHoisted as: ${target.hoistRole || 'N/A'}`,
                    inline: true
                  }, {
                    name: 'Dates',
                    value: `Account Created: \`${target.user.createdAt.toDateString()}\`\nJoined guild at: \`${target.joinedAt.toDateString()}`,
                    inline: true
                  }, {
                    name: 'Elevated Permissions',
                    value: ePerms.map(p => '**' + p + '**').join(', '),
                    inline: true
                  }]
                } })
        }

        if(command === 'animeglare') {

          const embed = new Discord.RichEmbed()
          .setAuthor('MarkBot')
          .setColor("RANDOM")
          .setThumbnail("https://pbs.twimg.com/profile_images/1141096628167892994/zA7ncCt2.png")
          .setDescription('Click the link below to get the app!\n\n https://animeglare.xyz/ \n Also now in the appstore:\n https://apps.apple.com/us/app/animeglare/id1472011019?ls=1 \n\n Have fun watching anime no Advertising!:heart:\n Work on Android<:Android:569060226766995456> and iOS<:ios:625404788682653706>!');
          embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
          message.channel.send(embed);
  
      }

  const GOOGLE_API_KEY = 'AIzaSyArOHhck-PsbRgoNqX3QrDjSsgHRPPiPsI';
  
  const youtube = new YouTube(GOOGLE_API_KEY);

  const queue = new Map();

  serverQueue = Client.queue.get(message.guild.id)

  if(command === "play") {
  const voiceChannel = message.member.voiceChannel
  const searchString = args.join(' ')
  const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''
  if (!voiceChannel) return message.channel.send('You must be in a voice channel to use this command.')
  const permissions = voiceChannel.permissionsFor(Client.user.id)
  if (!permissions.has('CONNECT')) return message.channel.send('I do not have the permissions to connect to your voice channel')
  if (!permissions.has('SPEAK')) return message.channel.send('I do not have the permissions to speak in that voice channel.')
  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await Client.youtube.getPlaylist(url)
    const videos = await playlist.getVideos()
    for (const video of Object.values(videos)) {
      const video2 = await Client.youtube.getVideoByID(video.id)
      await Client.handleVideo(video2, message, voiceChannel, true)
    }
    return message.channel.send(`Playlist: **${playlist.title}** has been added to the queue.`)
  } else {
    try {
      var video = await Client.youtube.getVideo(url)
    } catch (err) {
      try {
        var videos = await Client.youtube.searchVideos(searchString, 1)
        if (!videos[0]) return message.channel.send('No results found.')
        video = await Client.youtube.getVideoByID(videos[0].id)
      } catch (err) {
        console.log(err)
        return message.channel.send(`Error getting search results:\n\`${err}\``)
      }
    }
    return Client.handleVideo(video, message, voiceChannel)
  }
    }

    if(command === "p") {
      const voiceChannel = message.member.voiceChannel
      const searchString = args.join(' ')
      const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ''
      if (!voiceChannel) return message.channel.send('You must be in a voice channel to use this command.')
      const permissions = voiceChannel.permissionsFor(Client.user.id)
      if (!permissions.has('CONNECT')) return message.channel.send('I do not have the permissions to connect to your voice channel')
      if (!permissions.has('SPEAK')) return message.channel.send('I do not have the permissions to speak in that voice channel.')
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await Client.youtube.getPlaylist(url)
        const videos = await playlist.getVideos()
        for (const video of Object.values(videos)) {
          const video2 = await Client.youtube.getVideoByID(video.id)
          await Client.handleVideo(video2, message, voiceChannel, true)
        }
        return message.channel.send(`Playlist: **${playlist.title}** has been added to the queue.`)
      } else {
        try {
          var video = await Client.youtube.getVideo(url)
        } catch (err) {
          try {
            var videos = await Client.youtube.searchVideos(searchString, 1)
            if (!videos[0]) return message.channel.send('No results found.')
            video = await Client.youtube.getVideoByID(videos[0].id)
          } catch (err) {
            console.log(err)
            return message.channel.send(`Error getting search results:\n\`${err}\``)
          }
        }
        return Client.handleVideo(video, message, voiceChannel)
      }
        }
    
    if (command === 'skip') {
      if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
      if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
      serverQueue.connection.dispatcher.end('Skip command has been used!');
      return undefined;
    }

    if (command === 's') {
      if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
      if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
      serverQueue.connection.dispatcher.end('Skip command has been used!');
      return undefined;
    }

      if (command === 'stop') {
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
        if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop command has been used!');
        return undefined;
      }

      if (command === 'np') {
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
      }

      if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
    return message.channel.send('There is nothing playing.');
  }
  if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	}

  if (command === 'volume') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    return message.channel.send(`I set the volume to: **${args[0]}**`);
  }

  if(command == "queue"){
    const util = require('util')
if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel.')
if (!serverQueue) return message.channel.send('No song currently playing.')
if (serverQueue.voiceChannel.id !== message.member.voiceChannel.id) return message.channel.send('You are not in the same voice channel as me.')
let songQueue = [...serverQueue.songs]
const queue = []
const nowPlaying = songQueue.shift()
while (songQueue.length) {
  if (songQueue.length > 20) {
    const tarr = songQueue.splice(0, 20)
    queue.push(tarr)
  } else {
    queue.push([...songQueue])
    songQueue = []
  }
}
if (args[0] === 'remove' || args[0] === 'r') {
  if (args[1] === undefined || args[1] === '0') return message.channel.send('You did not select a song number to remove.')
  const toRemove = parseInt(args[1])
  if (!serverQueue.songs[(toRemove)]) return message.channel.send('Invalid song')
  const removed = serverQueue.songs.splice(toRemove, 1)
  return message.channel.send(`Removed **${removed[0].title}** from the queue`)
} else {
  let page
  if (!args[0]) {
    page = 1
  } else {
    page = parseInt(args[0])
  }
  if (queue.length === 0) return message.channel.send(`🎶 Currently playing: **${serverQueue.songs[0].title}**`)
  if (!page || page <= 0) return message.channel.send('Invalid page number.')
  const currentPage = []
  let i = 1
  if (!queue[(page - 1)]) return message.channel.send(`Invalid page\nThere are ${queue.length} pages`)
  queue[(page - 1)].forEach(s => {
    currentPage.unshift(`**${i + (20 * (page === 1 ? 0 : page - 1))}** | *${s.title}*`)
    i++
  })
  const queueEmbed = {
    title: 'Song Queue',
    description: `${currentPage.join('\n')}\n----------------\n**Now Playing:** *[${nowPlaying.title}](${nowPlaying.url})*`,
    footer: {
      text: `Page ${page} out of ${queue.length}`
    }
  }
  await message.channel.send({ embed: queueEmbed }).catch()
  }

    }

  if (command === 'helpmusic') {

    const embed = new Discord.RichEmbed()
    .setAuthor('MarkBot')
    .setColor("RANDOM")
    .setThumbnail("https://amuse.io/wp-content/uploads/2018/11/Amazon-Music-Logo-1476279710-640x400.png")
    .setDescription('~play\n Work with link and song name.\n\n~pause\n To pause the song. \n\n~resume\n To unpause the song.\n\n~np\n To see the current song that is playing\n\n~skip\n To skip the current song.\n\n~stop\n To stop the song.\n\n~queue\n To see what next.\n\n~queue remove\n To remove a song example: (~queue remove 2)\n\n~volume\n To change the volume of the music (still in progress)')
    embed.setFooter(`Command ran by ${message.author.username}`, message.author.avatarURL)
    message.channel.send(embed);
  }


});

client.login(process.env.BOT_TOKEN);


