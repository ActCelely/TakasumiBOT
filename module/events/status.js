module.exports = async(client)=>{
  
  client.user.setStatus("online");

  let stats = 0; 
  setInterval(()=>{
    if(stats === 0){
      client.user.setActivity(`/help || ping:${client.ws.ping}ms`,{
        type: "PLAYING"
      });
      stats = 1;
    }else if(stats === 1){
      client.user.setActivity(`${client.guilds.cache.size}server || ${client.guilds.cache.map((g)=>g.memberCount).reduce((a,c)=>a+c)}user`,{
        type: "PLAYING"
      });
      stats = 0;
    }
  },5000)

  client.channels.cache.get("947484748773736538").send("BOT、APIサーバーが再起動されました");

  console.log(`\x1b[34mINFO: Account ${client.user.tag}`);
  console.log(`\x1b[34mINFO: Server:${client.guilds.cache.size} User:${client.guilds.cache.map((g)=>g.memberCount).reduce((a,c)=>a+c)}`)
}