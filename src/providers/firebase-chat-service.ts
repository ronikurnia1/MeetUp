import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFire } from "angularfire2";
import * as firebase from 'firebase';
import "rxjs/Rx";

const DB_ROOT: string = "https://ipi-chat.firebaseio.com";

@Injectable()
export class FirebaseChatService {

  constructor(
    private db: AngularFireDatabase,
    private af: AngularFire) {
  }

  sendMessage(chatId: string, sender: any, receiver: any, message: string): firebase.Promise<void> {
    receiver.id = receiver.userId || receiver.id;
    let messageKey = this.db.list("messages/" + chatId).push({
      message: message,
      sender: sender.id,
      timeStamp: firebase.database.ServerValue.TIMESTAMP
    }).key;
    let values = {};
    values["messages/" + chatId + "/" + messageKey + "/timeStamp"] = firebase.database.ServerValue.TIMESTAMP;

    values["users/" + sender.id + "/chatsWith/" + receiver.id] = {
      chatId: chatId,
      id: receiver.id,
      lastMessage: message,
      firstName: receiver.firstName,
      lastName: receiver.lastName,
      title: receiver.title || "",
      avatar: receiver.avatar || "assets/icon/avatar.png",
      visible: true,
      timeStamp: firebase.database.ServerValue.TIMESTAMP
    };
    values["users/" + receiver.id + "/chatsWith/" + sender.id] = {
      chatId: chatId,
      id: sender.id,
      lastMessage: message,
      firstName: sender.firstName,
      lastName: sender.lastName,
      title: sender.title || "",
      avatar: sender.avatar || "assets/icon/avatar.png",
      visible: true,
      timeStamp: firebase.database.ServerValue.TIMESTAMP
    };
    return this.db.object(DB_ROOT).update(values);
  }

  getChatId(sender: any, receiver: any): Promise<any> {
    receiver.id = receiver.id || receiver.userId;
    return new Promise((resolve, error) => {
      let chatId: string;
      this.db.object("users/" + sender.id + "/chatsWith/" + receiver.id).take(1).subscribe(data => {
        if (data.$value) {
          // get existing chatId
          chatId = data.$value.chatId;
        } else {
          // or create a new one
          let chat = {};
          chat["members"] = {};
          chat["members"][sender.id] = true;
          chat["members"][receiver.id] = true;
          chatId = this.db.list("chats").push(chat).key;
        }
        resolve(chatId);
      }, error => {
        error(error);
      });
    });
  }

}
