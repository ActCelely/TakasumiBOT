module.exports = async(oldMessage,newMessage)=>{
  if(newMessage.author.id === "761562078095867916"){
    if(newMessage.embeds[0]?.fields[0].name.match(/をアップしたよ/)||newMessage.embeds[0]?.fields[0].name.match(/I've bumped up/)){
      await newMessage.channel.send({
        embeds:[{
          color: "BLUE",
          title:"UP通知",
          description:"UPを受信しました\n1時間後に通知します"
        }]  
      }).catch(()=>{})

      setTimeout(async()=>{
        await newMessage.channel.send({
          embeds:[{
            color: "BLUE",
            title:"UP通知",
            description:"DISSOKUの時間です\n`/dissoku up`でサーバーの表示順位を上げよう！"
          }]  
        }).catch(()=>{})
      },60000 * 60)
    }
  }
}