<template>
  <div class="chat-container" ref="chatContainer">
    <div
      class="message-wrapper"
      :class="{ self: message.ename === currHero.ename }"
      v-for="message in messages"
      :key="message.ename"
    >
      <div class="sender-info-wrapper">
        <div class="sender-info">
          <div>{{ message.time }}</div>
          <div>{{ message.cname }}</div>
        </div>
        <div :style="{ backgroundColor: message.color }" class="message">
          {{ message.content }}
        </div>
      </div>
      <img
        :src="getImageUrl(message.ename)"
        alt=""
        :onerror="(e) => (e.target.src = './src/assets/avatar.png')"
      />
    </div>
  </div>
  <input
    type="text"
    v-model="newMsg"
    @keydown.enter="sendMessage"
    placeholder="Type your message..."
  />
  <button @click="sendMessage">Send</button>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import HeroApi from "../services/hero";
import { getRandomColor } from "../utils/index";
import { Hero, Message } from "@/types";

const heroList = ref<Hero[]>();
const newMsg = ref("");
const messages = ref<Message[]>([]);
const currHero = ref<Hero | null>(null);
const chatContainer = ref<HTMLElement | null>(null);

const ydoc = new Y.Doc();
const wsProvider = new WebsocketProvider(
  "ws://localhost:1234",
  "hero-chat",
  ydoc
);
const yarray = ydoc.getArray<Message>("chat");

HeroApi.getList().then((res: Hero[]) => {
  heroList.value = res;
  currHero.value = res[Math.floor(Math.random() * (res.length - 1))];
  updateUserData(currHero.value.cname);
});
function updateUserData(userName: string) {
  const userColor = getRandomColor();
  wsProvider.awareness.setLocalStateField("color", userColor);
  wsProvider.awareness.setLocalStateField("userName", userName);
  // 监听 Yjs 更新事件
  yarray.observe((event: Y.YArrayEvent<Message>) => {
    event.changes.added.forEach((item) => {
      item.content.getContent().forEach((message: Message) => {
        messages.value.push(message);
      });
    });
  });
}

function getImageUrl(ename: number) {
  return `https://game.gtimg.cn/images/yxzj/img201606/heroimg/${ename}/${ename}.jpg`;
}

function sendMessage() {
  const messageContent = newMsg.value.trim();
  if (messageContent === "") return;
  const state = wsProvider.awareness.getLocalState();
  const message: Message = {
    content: messageContent,
    clientId: wsProvider.awareness.clientID,
    time: new Date().toLocaleTimeString(),
    cname: state!.userName as string,
    ename: currHero.value.ename,
    color: state!.color as string,
  };
  yarray.push([message]);
  newMsg.value = "";
}
watch(messages.value, async () => {
  if (!chatContainer.value) return;
  await nextTick();
  chatContainer.value.scrollTo({
    top: chatContainer.value.scrollHeight,
    behavior: "smooth",
  });
});
</script>

<style scoped lang="less">
.chat-container {
  width: 90vw;
  height: 400px;
  padding: 10px;
  border-radius: 8px;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  scrollbar-color: skyblue #fcfcfc;
}

.message-wrapper {
  width: fit-content;
  margin: 10px;
  display: flex;
  img {
    width: 68px;
    height: 68px;
    clip-path: circle(50% at 50% 50%);
    margin: 0 10px;
    order: -1;
  }
  .sender-info-wrapper {
    max-width: calc(100vw - 300px);
  }
  .sender-info {
    width: fit-content;
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    color: black;
    div:first-child {
      color: #ccc;
      order: 1;
    }
  }
  .message {
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    width: fit-content;
    word-wrap: break-word;
    color: black;
  }
  &.self {
    margin-left: auto;
    img {
      order: 1;
    }
    .sender-info {
      width: 100%;
      justify-items: end;
      & > div:first-child {
        order: -1;
      }
    }
    .message {
      margin-left: auto;
    }
  }
}

input {
  width: calc(60% - 60px);
  height: 28px;
  box-sizing: content-box;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  border: 1px solid #666;
  margin-bottom: 10px;
  outline-color: transparent;
  caret-color: #1890ff;
  &:focus {
    outline-color: skyblue;
  }
}
button {
  height: 28px;
  box-sizing: content-box;
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #666;
  margin-left: 10px;
  color: #666;
  cursor: pointer;
  outline: revert;
  &:hover {
    outline: revert;
    border-color: #1890ff;
    color: #1890ff;
  }
}
</style>