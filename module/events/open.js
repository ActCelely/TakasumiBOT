async function open(message,client){
  if(message.author.bot) return;  
  if(message.content.match(/https?:\/\/(?:ptb\.|canary\.)?(?:discord|discordapp)\.com\/channels\/\d{18,19}\/\d{18,19}\/\d{18,19}/g)){
    const url = message.content.match(/https?:\/\/(?:ptb\.|canary\.)?(?:discord|discordapp)\.com\/channels\/\d{18,19}\/\d{18,19}\/\d{18,19}/);

    const id = url.split("/");
    const channel = client.channels.cache.get(id[5]);
    if(!channel) return;
    const msg = await channel.messages.fetch(id[6])
      .catch(()=>{return})

    if(!msg.attachments?.first()){
      message.channel.send({//添付ファイルなし
        embeds:[{
          color: msg.member?.displayHexColor||"WHITE",
          author: {
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: msg.content || "メッセージ内容がありません",
          footer: {
            text: `#${msg.channel.name}`
          },
          timestamp: msg.createdAt
        }]
      });
    }else if(msg.attachments?.first().height && msg.attachments?.first().width){
      const attachment = msg.attachments.map(attachment => attachment.url)
      message.channel.send({//添付ファイルあり(画像)
        embeds:[{
          color: msg.member?.displayHexColor||"WHITE",
          author: {
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: msg.content || "メッセージ内容がありません",
          image: {
            url: attachment[0]
          },
          footer: {
            text: `#${msg.channel.name}`
          },
          timestamp: msg.createdAt
        }]
      });
    }else{
      const attachment = msg.attachments.map(attachment => attachment?.url)
      message.channel.send({//添付ファイルあり(画像以外)
        embeds:[{
          color: msg.member?.displayHexColor||"WHITE",
          author: {
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: msg.content || "メッセージ内容がありません",
          footer: {
            text: `#${msg.channel.name}`
          },
          fields: [
            {
              name: "添付ファイル",
              value: `${attachment[0]||"エラー"}`
            }
          ],
          timestamp: msg.createdAt
        }]
      });
    }
    return;
  }
}

module.exports = open