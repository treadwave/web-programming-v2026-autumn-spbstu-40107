import {User} from './model.js';

// Реализуйте асинхронную логику UI и синхронизацию с localStorage.

const STORAGE_KEY = 'lab4_users_state';

function asyncOperation(fn, delay = 50) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
}

class App {
  constructor() {
    this.users = [];
    this.listContainer = document.querySelector('[data-testid="entity-list"]');
    this.createForm = document.querySelector('form[data-testid="entity-form"]');

    this.init();
  }

  init() {
    this.loadState();
    this.render();

    this.createForm.addEventListener('submit', (e) => this.handleCreateUser(e));
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.users = parsed.map(
          (item) => new User(item.id, item.name, item.friends),
        );
      }
    } catch {
      this.users = [];
    }
  }

  saveState() {
    const serialized = this.users.map((u) => ({
      id: u.id,
      name: u.name,
      friends: u.friends,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }

  async handleCreateUser(e) {
    e.preventDefault();
    const formData = new FormData(this.createForm);
    const id = Number(formData.get('id'));
    const name = String(formData.get('name')).trim();

    if (!id || !name) {
      return;
    }

    if (this.users.some((u) => u.id === id)) {
      alert('Пользователь с таким ID уже существует');
      return;
    }

    const submitBtn = this.createForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      await asyncOperation(() => {
        const newUser = new User(id, name);
        this.users.push(newUser);
        this.saveState();
      });

      this.createForm.reset();
      this.render();
    } finally {
      submitBtn.disabled = false;
    }
  }

  async handleDeleteUser(id) {
    await asyncOperation(() => {
      this.users = this.users.filter((u) => u.id !== id);
      this.saveState();
    });
    this.render();
  }

  async handleAddFriend(userId, friendId) {
    if (!friendId || isNaN(friendId)) {
      return;
    }

    await asyncOperation(() => {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.addFriend(Number(friendId));
        this.saveState();
      }
    });
    this.render();
  }

  async handleRemoveFriend(userId, friendId) {
    await asyncOperation(() => {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.removeFriend(Number(friendId));
        this.saveState();
      }
    });
    this.render();
  }

  render() {
    this.listContainer.innerHTML = '';

    this.users.forEach((user) => {
      const card = document.createElement('div');
      card.className = 'entity-card';
      card.setAttribute('data-testid', 'entity-card');

      const header = document.createElement('div');
      header.className = 'entity-card-header';

      const title = document.createElement('div');
      title.innerHTML = `<strong>${user.name}</strong> (ID: ${user.id}) — Друзей: ${user.friendCount}`;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('data-testid', 'delete-entity');
      deleteBtn.textContent = 'Удалить пользователя';
      deleteBtn.addEventListener('click', () => this.handleDeleteUser(user.id));

      header.appendChild(title);
      header.appendChild(deleteBtn);
      card.appendChild(header);

      const friendsSection = document.createElement('div');
      friendsSection.className = 'friends-section';

      const friendsList = document.createElement('div');
      friendsList.textContent = 'Друзья (ID): ';
      if (user.friends.length === 0) {
        friendsList.textContent += 'нет';
      } else {
        user.friends.forEach((fId) => {
          const badge = document.createElement('span');

          badge.className = 'friend-item';
          badge.textContent = fId;

          const removeFriendBtn = document.createElement('button');
          removeFriendBtn.className = 'remove-friend-btn';
          removeFriendBtn.innerHTML = '&times;';
          removeFriendBtn.title = 'Удалить друга';
          removeFriendBtn.addEventListener('click', () =>
            this.handleRemoveFriend(user.id, fId),
          );

          badge.appendChild(removeFriendBtn);
          friendsList.appendChild(badge);
        });
      }

      const friendForm = document.createElement('form');
      friendForm.style.marginTop = '8px';

      const friendInput = document.createElement('input');
      friendInput.type = 'number';
      friendInput.placeholder = 'ID друга';
      friendInput.required = true;

      const addFriendBtn = document.createElement('button');
      addFriendBtn.type = 'submit';
      addFriendBtn.textContent = 'Добавить друга';

      friendForm.appendChild(friendInput);
      friendForm.appendChild(addFriendBtn);

      friendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddFriend(user.id, Number(friendInput.value));
      });

      friendsSection.appendChild(friendsList);
      friendsSection.appendChild(friendForm);
      card.appendChild(friendsSection);

      this.listContainer.appendChild(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
