module.exports = async(interaction)=>{
  const mysql = require("../lib/mysql");
  if(!interaction.isContextMenu()) return;
  if(interaction.commandName === "メンバー情報を表示"){
    const member = interaction.options.getMember("user");

    if(!member) return await interaction.reply({
      embeds:[{
        author: {
          name: "メンバーを取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png",
        },
        color: "RED",
        description:"指定したユーザーが存在していないか、サーバーから退出しています"
      }],
      ephemeral:true
    });

    const members = await mysql(`SELECT * FROM account WHERE id = ${member.user.id} LIMIT 1;`);

    await interaction.reply({
      embeds:[{
        color: "GREEN",
        author: {
          name:`${member.user.tag}の検索結果`,
          url: `https://discord.com/users/${member.user.id}`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        timestamp: new Date(),
        footer: {
          text: "TakasumiBOT"
        },
        thumbnail: {
          url: member.user.avatarURL({ format: "png", dynamic: true, size: 1024 }) || "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        fields: [
          {
            name: "ID",
            value: `${member.user.id}`,
            inline: true
          },
          {
            name: "ニックネーム",
            value: member.nickname||"未設定",
            inline: true
          },
          {
            name: "作成日時",
            value: `${new Date(member.user.createdTimestamp).toLocaleDateString()}\n(${Math.round((Date.now() - member.user.createdAt) / 86400000)}日前)`,
            inline: true
          },
          {
            name:"参加日時",
            value: `${new Date(member.joinedTimestamp).toLocaleDateString()}\n(${Math.round((Date.now() - member.joinedAt) / 86400000)}日前)`,
            inline: true
          },
          {
            name: "アカウントの種類",
            value: member.user.bot ? "BOT" : "ユーザー",
            inline: true
          },
          {
            name: "TakasumiBOT Membersへの加入",
            value: members[0] ? "加入済み" : "未加入"
          },
          {
            name:"ロール",
            value: `${member.roles.cache.map(r => r).join("")}`
          }
        ]
      }]
    })
    .catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          author: {
            name: "正常に送信できませんでした",
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
      })
    });
  }
}