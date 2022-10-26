async function global(message,client){
  const mute_user = require("../../data/block_user.json");
  const mute_server = require("../../data/block_server.json");
  const main = require("../../data/global/main.json");
  const sub = require("../../data/global/sub.json");
  const spam = require("../lib/spam");
  const { WebhookClient } = require("discord.js");
  const fs = require("fs");

  if(
    !message.channel.type === "GUILD_TEXT"||
    message.author.bot||
    !main[message.channel.id]||
    message.reference?.messageId
  ) return;

  if(
    mute_server[message.guild.id]||
    mute_user[message.author.id]||
    message.content.length > 300||
    spam(message)
  ){
    return message.react("❌")
      .catch(()=>{}) 
  }

  const content = message.content
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,"[[招待リンク]](https://discord.gg/GPs3npB63m)")

  if(!message.attachments.first()){
    Object.keys(main).forEach(async (channels)=>{//添付ファイルなし

      const guild = Object.keys(sub).filter((key)=> sub[key] === channels);
      if(channels === message.channel.id||mute_server[guild]) return;

      const webhooks = new WebhookClient({id: main[channels][0], token: main[channels][1]});
      await webhooks.send({
        embeds:[
          {
            color: (await message.author.fetch()).hexAccentColor || "RANDOM",
            author: {
              name: `${message.author.tag}`,
              url: `https://discord.com/users/${message.author.id}`,
              icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
            },
            description: content,
            footer: {
              text:`${message.guild.name}<${message.guild.id}>`,
              icon_url:message.guild.iconURL() ||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            timestamp: new Date()
          }
        ]      
      }).catch((error)=>{
        delete main[channels];
        const guild = Object.keys(sub).filter((key)=> sub[key] === channels);
        delete sub[guild];
        fs.writeFileSync("./data/global/main.json", JSON.stringify(main), "utf8");
        fs.writeFileSync("./data/global/sub.json", JSON.stringify(sub), "utf8");
        delete require.cache[require.resolve("../../data/global/sub.json")];
        delete require.cache[require.resolve("../../data/global/main.json")];

        client.channels.cache.get(channels).send({
          embeds:[{
            author: {
              name: "グローバルチャットでエラーが発生しました",
              icon_url: "https://cdn.taka.ml/images/error.png",
            },
            color: "RED",
            description: "エラーが発生したため、強制的に切断されました\n再度登録するには`/global`を使用してください",
            fields: [
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }]
        })
        .catch(()=>{})

      });
    });
    message.react("✅")
      .catch(()=>{});
  }else if(message.attachments.first().height && message.attachments.first().width){//添付ファイルあり(画像)
    const attachment = message.attachments.map(attachment => attachment);
    Object.keys(main).forEach(async (channels)=>{

      const guild = Object.keys(sub).filter((key)=> sub[key] === channels);
      if(channels === message.channel.id||mute_server[guild]) return;

      const webhooks = new WebhookClient({id: main[channels][0], token: main[channels][1]});
      await webhooks.send({
        embeds:[
          {
            color: (await message.author.fetch()).hexAccentColor || "RANDOM",
            author: {
              name: `${message.author.tag}`,
              url: `https://discord.com/users/${message.author.id}`,
              icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
            },
            description: content,
            footer: {
              text: `${message.guild.name}<${message.guild.id}>`,
              icon_url:message.guild.iconURL() ||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            timestamp: new Date()
          },
          {
            title: attachment[0].name,
            image: {
              url: attachment[0].url
            }
          }
        ]
      }).catch((error)=>{
        delete main[channels];
        const guild = Object.keys(sub).filter((key)=> sub[key] === channels);
        delete sub[guild];
        fs.writeFileSync("./data/global/main.json", JSON.stringify(main), "utf8");
        fs.writeFileSync("./data/global/sub.json", JSON.stringify(sub), "utf8");
        delete require.cache[require.resolve("../../data/global/sub.json")];
        delete require.cache[require.resolve("../../data/global/main.json")];

        client.channels.cache.get(channels).send({
          embeds:[{
            author: {
              name: "グローバルチャットでエラーが発生しました",
              icon_url: "https://cdn.taka.ml/images/error.png",
            },
            color: "RED",
            description: "エラーが発生したため、強制的に切断されました\n再度登録するには`/global`を使用してください",
            fields: [
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }]
        })
        .catch(()=>{})

      });
    });
    message.react("✅")
      .catch(()=>{});
  }else{//添付ファイルあり(画像以外)
    const attachment = message.attachments.map(attachment => attachment);

    Object.keys(main).forEach(async (channels)=>{

      const guild = Object.keys(sub).filter((key)=> sub[key] === channels);
      if(channels === message.channel.id||mute_server[guild]) return;

      const webhooks = new WebhookClient({id: main[channels][0], token: main[channels][1]});
      await webhooks.send({
        embeds:[
          {
            color: (await message.author.fetch()).hexAccentColor || "RANDOM",
            author: {
              name: `${message.author.tag}`,
              url: `https://discord.com/users/${message.author.id}`,
              icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
            },
            description: content,
            footer: {
              text:`${message.guild.name}<${message.guild.id}>` ,
              icon_url:message.guild.iconURL() ||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            fields: [
              {
                name: "添付ファイル",
                value: `[${attachment[0].name}](${attachment[0].url})`
              }
            ],
            timestamp: new Date()
          }
        ]
      }).catch((error)=>{
        delete main[channels];
        const guild = Object.keys(sub).filter((key)=> sub[key] === channels);
        delete sub[guild];
        fs.writeFileSync("./data/global/main.json", JSON.stringify(main), "utf8");
        fs.writeFileSync("./data/global/sub.json", JSON.stringify(sub), "utf8");
        delete require.cache[require.resolve("../../data/global/sub.json")];
        delete require.cache[require.resolve("../../data/global/main.json")];

        client.channels.cache.get(channels).send({
          embeds:[{
            author: {
              name: "グローバルチャットでエラーが発生しました",
              icon_url: "https://cdn.taka.ml/images/error.png",
            },
            color: "RED",
            description: "エラーが発生したため、強制的に切断されました\n再度登録するには`/global`を使用してください",
            fields: [
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }]
        })
        .catch(()=>{})
        
      });
    });
    message.react("✅")
      .catch(()=>{});
  }
}

module.exports = global
