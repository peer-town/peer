import {Clients} from "../../core/types";

export const attachTelegramListeners = (clients: Clients) => {
  const telegraf = clients.telegraf;
  telegraf.start((context) => {
    context.reply('Hello ' + context.from.first_name + '!');
  });

  telegraf.command("info", (context) => {
    context.reply(JSON.stringify(context.botInfo));
  });

  telegraf.command("ask", (context) => {
    context.createForumTopic(context.message.text.replace("/ask ", ""))
      .then((res) => {
        context.reply("Your thread id is " + res.message_thread_id);
      });
  });

  telegraf.on("text", async (context) => {
    telegraf.telegram.sendMessage(context.message.chat.id, "hi from direct id", {
      message_thread_id: 10,
    });
    // console.log(context.message.message_thread_id);
    // if (context.message.message_thread_id === 10) {
    //   context.reply("Hi, you have responded in some thread!");
    // }
  });

  telegraf.launch();
  console.log("telegram bot has all ears!");
};
