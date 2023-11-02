import { ActionContext, ActionTree, MutationTree, createStore } from 'vuex';
import { api } from './axios';
import { Data, User } from './types';

interface State {
  response: Data;
  loadingStatus: boolean;
  newUser: User;
}

export enum ActionTypes {
  FETCH_DATA= 'fetchData',
  LOAD_DATA_FROM_STORAGE = 'loadDataFromStorage',
}

export enum MutationTypes {
  SET_RESPONSE = 'setResponse',
  SET_LOADING_STATUS = 'setLoadingStatus',
  REMOVE_USER = 'removeUser',
  ADD_USER = 'addUser',
  UPDATE_USER = 'updateUser'
}

const state: State = {
  response: {
    page: 0,
    per_page: 0,
    total: 0,
    total_pages: 0,
    data: [],
    support: {
      url: '',
      text: '',
    },
  },
  loadingStatus: true,
  newUser: {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
  },
};

const actions: ActionTree<State, State> = {
  async [ActionTypes.FETCH_DATA](context: ActionContext<State, State>) {
    try {
      const response = await api.get<Data>('');
      const responseJson = JSON.stringify(response.data);
      context.commit(MutationTypes.SET_RESPONSE, response.data);
      localStorage.setItem('storageData', responseJson);
    } catch (error) {
      console.error('Помилка завантаження користувачів:', error);
    } finally {
      context.commit(MutationTypes.SET_LOADING_STATUS, false);
    }
  },
  [ActionTypes.LOAD_DATA_FROM_STORAGE](context: ActionContext<State, State>) {
    const localData = localStorage.getItem('storageData');
    if (localData) {
      context.commit(MutationTypes.SET_RESPONSE, JSON.parse(localData));
      context.commit(MutationTypes.SET_LOADING_STATUS, false);
    }
  },
};

const mutations: MutationTree<State> = {
  [MutationTypes.SET_RESPONSE](state: State, payload: Data) {
    state.response = payload;
  },
  [MutationTypes.SET_LOADING_STATUS](state: State, isLoading: boolean) {
    state.loadingStatus = isLoading;
  },
  [MutationTypes.REMOVE_USER](state: State, userId: number) {
    const index = state.response.data.findIndex(user => user.id === userId);

    if (index !== -1) {
      state.response.data.splice(index, 1);
      const localData = localStorage.getItem('storageData');
      
      if (localData) {
        const storagData = JSON.parse(localData);
        const newData = {
          ...storagData,
          data: storagData.data.filter((user: User) => user.id !== userId),
        };
        localStorage.setItem('storageData', JSON.stringify(newData));
      }
    }
  },
  [MutationTypes.ADD_USER](state: State, newUser: User) {
    state.response.data.push(newUser);
    const localData = localStorage.getItem('storageData');
    if (localData) {
      const storageData = JSON.parse(localData);
      storageData.data.push(newUser);
      localStorage.setItem('storageData', JSON.stringify(storageData));
    }
  },
  [MutationTypes.UPDATE_USER](state: State, updatedUser: User) {
    const userIndex = state.response.data.findIndex((user) => user.id === updatedUser.id);
    
    if (userIndex !== -1) {
      state.response.data[userIndex] = updatedUser;
      
      const localData = localStorage.getItem('storageData');
      
      if (localData) {
        const storageData = JSON.parse(localData);
        const updatedUserData = storageData.data.map((user: User) => {
          if (user.id === updatedUser.id) {
            return { ...user, ...updatedUser };
          }
          return user;
        });
  
        storageData.data = updatedUserData;
        localStorage.setItem('storageData', JSON.stringify(storageData));
      }
    }
  },
};

export const store = createStore({
  state,
  mutations,
  actions,
});
