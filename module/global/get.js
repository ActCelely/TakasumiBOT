function get(message,client){
  if(message.channel.id != "949862388969119755" || message.author.id == client.user.id || !message.embeds[0].description) return;
  let msg = JSON.parse(new Buffer.from(message.embeds[0].description, "base64"));
  message.react("🔁")

  client.channels.cache.get("949900405012324372").send({//解読コード
    embeds: [{
      description: JSON.stringify(msg,null,"　")
    }]
  });

  if(!msg.hasOwn(msg, "attachments")){
    client.channels.cache.filter(channel => channel.topic == "==GLOBAL==").forEach((channel) =>{
      channel.send({//添付ファイルなし
        embeds:[{
          color: "WHITE",
          author: {
            name: `${msg.author.username}${msg.author.discriminator}`,
            icon_url: msg.author.avatarURL ||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: msg.message.content,
          footer: {
            text: `${msg.guild.name} <${message.author.username}>`,
            icon_url:msg.guild.iconURL ||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
          timestamp: new Date()
        }]
      });
    });
    message.react("✅")
    return;
  }else if(msg.hasOwn(msg, "hight") && msg.hasOwn(msg, "width")){
    client.channels.cache.filter(channel => channel.topic == "==GLOBAL==").forEach((channel) =>{
      channel.send({//添付ファイルあり(画像)
        embeds:[{
          color: "WHITE",
          author: {
            name: `${msg.author.username}${msg.author.discriminator}`,
            icon_url: msg.author.avatarURL ||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description:msg.message.content,
          image: {
            url: msg.message.attachments[0].url
          },
          footer: {
            text: `${msg.guild.name} <${message.author.username}>`,
            icon_url:msg.guild.iconURL ||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
          timestamp: new Date()
        }]
      });
    });
    message.react("✅")
    return;
  }else{
    client.channels.cache.filter(channel => channel.topic == "==GLOBAL==").forEach((channel) =>{
      channel.send({//添付ファイルあり(画像以外)
        embeds:[{
          color: "WHITE",
          author: {
            name: `${msg.author.username}${msg.author.discriminator}`,
            icon_url: msg.author.avatarURL ||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description:msg.message.content,
          footer: {
            text: `${msg.guild.name} <${message.author.username}>`,
            icon_url:msg.guild.iconURL ||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
          fields: [
            {
              name: "**添付ファイル**",
              value: msg.message.attachments[0].url
            }
          ],
          timestamp: new Date()
        }]
      });
    });
    message.react("✅")
    return;
  }
}

module.exports = get