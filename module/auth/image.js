module.exports = async(interaction)=>{
  const { MessageActionRow, MessageSelectMenu } = require("discord.js");
  const random = require("../lib/random");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("image_")){
    const role = interaction.customId.split("_");
    const keys = [
      {text:"2daAfg",url:"https://cdn.taka.ml/images/auth/img_1.png"},
      {text:"wad3EF",url:"https://cdn.taka.ml/images/auth/img_2.png"},
      {text:"G4sveS",url:"https://cdn.taka.ml/images/auth/img_3.png"},
      {text:"3dgHR",url:"https://cdn.taka.ml/images/auth/img_4.png"},
      {text:"ascA23",url:"https://cdn.taka.ml/images/auth/img_5.png"},
      {text:"Cd2d4s",url:"https://cdn.taka.ml/images/auth/img_6.png"},
      {text:"Mgfn4",url:"https://cdn.taka.ml/images/auth/img_7.png"},
      {text:"Hsdgs1",url:"https://cdn.taka.ml/images/auth/img_8.png"}
    ];

    const auth = random(keys);

    const selects = new MessageSelectMenu()
      .setCustomId(`imagerole_${role[1]}_${auth.text}`)
      .setPlaceholder("正しいものを選択")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        keys.map(c=>({
          label: `${c.text}`,
          value: c.text,
        }))
      )

    await interaction.reply({
      embeds:[{
        title: "画像認証",          
        color: "GREEN",
        description: "画像にある文字を選択してください",
        image: {
          url: `${auth.url}`
        }
      }],
      components: [     
        new MessageActionRow()
          .addComponents(selects)
      ],
      ephemeral:true
    });
  }
}