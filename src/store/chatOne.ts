import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { OpenAiChatEnum } from '@/constants/model';

import { HistoryItemType, ChatType } from '@/types/chatOne';
import { getChatHistory } from '@/api/chat';

type State = {
  history: HistoryItemType[];
  loadHistory: (data: { pageNum: number; init?: boolean }) => Promise<null>;
  forbidLoadChatData: boolean;
  setForbidLoadChatData: (val: boolean) => void;
  chatData: ChatType;
  setChatData: (e?: ChatType | ((e: ChatType) => ChatType), status?: string) => void;
  // setChatData: any;
  // lastChatModelId: string;
  // setLastChatModelId: (id: string) => void;
  // lastChatId: string;
  // setLastChatId: (id: string) => void;
};

const defaultChatData = {
  model: {
    name: '',
    avatar: '/icon/logo.png',
    intro: '',
    canUse: false
  },
  chatModel: OpenAiChatEnum.GPT35,
  history: []
};

export const useChatStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({
        history: [],
        async loadHistory({ pageNum, init = false }: { pageNum: number; init?: boolean }) {
          if (get().history.length > 0 && !init) return null;
          const data = await getChatHistory({
            pageNum,
            pageSize: 20
          });
          set((state) => {
            state.history = data;
          });
          return null;
        },
        forbidLoadChatData: false,
        setForbidLoadChatData(val: boolean) {
          set((state) => {
            state.forbidLoadChatData = val;
          });
        },
        chatData: defaultChatData,
        setChatData(
          e: ChatType | ((e: ChatType) => ChatType) = defaultChatData,
          status: string | undefined
        ) {
          if (typeof e === 'function') {
            set((state) => {
              state.chatData = e(state.chatData);
              console.log(status, 'gptChatPrompt', state.chatData);

              if (status) {
                localStorage.setItem(
                  status,
                  JSON.stringify({ translateList: [...state.chatData.history] })
                );
              }
            });
          } else {
            set((state) => {
              state.chatData = e;
            });
          }
        }
      })),
      //不需要持久化
      {
        name: '', // key
        partialize: (state) => ({
          // lastChatModelId: state.lastChatModelId,
          // lastChatId: state.lastChatId
        })
      }
    )
  )
);
