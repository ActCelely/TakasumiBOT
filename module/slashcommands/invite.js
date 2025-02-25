module.exports = async(interaction)=>{
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "invite"){
    const time = interaction.options.getInteger("time");
    const use = interaction.options.getInteger("use");

    if(!interaction.member.permissions.has("CREATE_INSTANT_INVITE")) return await interaction.reply({
      embeds:[{
        author: {
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "このコマンドを実行するには、あなたがこのサーバーの\n`招待リンクの作成`の権限を持っている必要があります"
      }],
      ephemeral:true
    });
  
    if(!interaction.guild.me.permissionsIn(interaction.channel).has("CREATE_INSTANT_INVITE")) return await interaction.reply({
      embeds:[{
        author: {
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "このコマンドは、BOTに以下の権限が必要です\n```招待リンクの作成```"
      }],
      ephemeral:true
    });

    await interaction.channel.createInvite({
      "maxAge": time,
      "maxUses": use,
      "unique": true,
      "reason": `${interaction.member.user.tag}により作成`
    })
      .then(async(invite)=>{
        await interaction.reply({
          content: invite.url
        })
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author: {
              name: "招待リンクを作成できませんでした",
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
      });
  }
}