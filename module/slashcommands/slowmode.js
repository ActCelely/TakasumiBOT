module.exports = async(interaction)=>{
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "slowmode"){
    const time = interaction.options.getInteger("time");
  
    if(
      !interaction.member.permissions.has("MANAGE_MESSAGES")||
      !interaction.member.permissions.has("MANAGE_CHANNELS")
    ) return await interaction.reply({
      embeds:[{
        author: {
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "このコマンドを実行するには、あなたがこのサーバーで以下の権限を持っている必要があります\n```メッセージを管理\nチャンネルの管理```"
      }],
      ephemeral:true
    });
   
    if(!interaction.guild.me.permissionsIn(interaction.channel).has("MANAGE_CHANNELS")) return await interaction.reply({
      embeds:[{
        author: {
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "この機能は、BOTに以下の権限が必要です\n```チャンネルの管理```"
      }],
      ephemeral:true
    });

    if(time < 0 || time > 21600 ) return await interaction.reply({
      embeds:[{
        author: {
          name: "引数が無効です",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "削除するメッセージの数は0秒以上、21600秒以下にする必要があります"
      }],
      ephemeral:true
    });

    await interaction.channel.setRateLimitPerUser(time)
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            author: {
              name: `低速モードを設定しました`,
              icon_url: "https://cdn.taka.ml/images/system/success.png",
            },
            description:`低速モードは現在${time}秒です`,
            color: "GREEN"
          }]
        })
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author: {
              name: "低速モードが設定できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png",
            },
            color: "RED",
            fields: [
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral:true
        });
      })
  }
}