module.exports = async(interaction)=>{
  const mysql = require("../lib/mysql");
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("web_")){
    const role = interaction.customId.split("_");

    if(interaction.member.roles.cache.has(role[1])) return await interaction.reply({
      embeds:[{
        author: {
          name: "既に認証済みです",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
      }],
      ephemeral:true
    });

    const members = await mysql(`SELECT * FROM account WHERE id = ${interaction.member.user.id} LIMIT 1;`);

    if(!members[0]) return await interaction.reply({
      embeds:[{
        author: {
          name: "認証に失敗しました",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description: "TakasumiBOT Membersに登録されていないため、認証できません\n以下のリンクから登録してください"
      }],
      components: [
        new MessageActionRow()
          .addComponents( 
            new MessageButton()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.taka.ml/")
              .setStyle("LINK")
          )
      ],
      ephemeral:true
    });

    await interaction.member.roles.add(role[1])
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            author: {
              name: "認証しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png",
            },
            color: "GREEN"
          }],
          ephemeral: true
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author: {
              name: "認証に失敗しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png",
            },
            color: "RED",
            description: "BOTの権限が不足しているか、付与するロールがBOTより上の可能性があります",
            fields: [
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral:true
        })
      })
  }
}