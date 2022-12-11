module.exports = async(interaction)=>{
  const mysql = require("../lib/mysql.js");
  if(!interaction.isContextMenu()) return;
  if(interaction.commandName === "メッセージをピン留め"){
    const message = await interaction.options.getMessage("message");
    if(!message.content) return await interaction.reply({
      embeds:[{
        author: {
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "メッセージの内容が存在しません"
      }],
      ephemeral:true
    });

    if(
      !interaction.guild.me.permissionsIn(interaction.channel).has("VIEW_CHANNEL")||
      !interaction.guild.me.permissionsIn(interaction.channel).has("SEND_MESSAGES")||
      !interaction.guild.me.permissionsIn(interaction.channel).has("MANAGE_MESSAGES")||
      !interaction.guild.me.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")
    ) return await interaction.reply({
      embeds:[{
        author: {
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "グローバルチャットは、BOTに以下の権限が必要です\n```チャンネルの閲覧\nメッセージを送信\nメッセージの管理\nチャンネルの管理```"
      }],
      ephemeral:true
    });

    if(
      !interaction.member.permissions.has("MANAGE_CHANNELS")||
      !interaction.member.permissions.has("MANAGE_MESSAGES")
    ) return await interaction.reply({
      embeds:[{
        author: {
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "このコマンドを実行するには、あなたがこのサーバーで以下の権限を持っている必要があります\n```メッセージの管理\nチャンネルの管理```"
      }],
      ephemeral:true
    });
      
    const channel = await mysql(`SELECT * FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
    const server = await mysql(`SELECT * FROM pin WHERE server = ${message.guild.id};`);
    if(channel[0]) return await interaction.reply({
      embeds:[{
        author: {
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "既にこのチャンネルにはピン留めされたメッセージが存在します\nピン留めの解除は送信された埋め込みを削除してください"
      }],
      ephemeral:true
    });

    if(server[0]?.count > 2) return await interaction.reply({
      embeds:[{
        author: {
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "サーバーには最大8個までしかPINは使えません\nピン留めの解除は送信された埋め込みを削除してください"
      }],
      ephemeral:true
    });

    const msg = await interaction.channel.send({
      embeds:[{
        color: "GREEN",
        author: {
          name: message.author.tag,
          icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
        },
        description: message.content,
        footer: {
          text:"TakasumiBOT PIN"
        }
      }],
      fetchReply: true
    });

    await mysql(`INSERT INTO pin (channel, server, message, count) VALUES("${message.channel.id}","${message.guild.id}","${msg.id}","0");`);
    server.forEach(data=>{
      console.log(Number(data.count)+1)
      mysql(`UPDATE pin SET count=${Number(data.count)+1} WHERE server=${message.guild.id};`);
    });

    await interaction.deferReply()
      .then(()=>interaction.deleteReply())
  }
}