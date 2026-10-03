export class User {
  constructor(id, name, friends = []) {
    this.id = Number(id);
    this.name = String(name);
    this.friends = Array.isArray(friends) ? friends.map(Number) : [];
  }

  addFriend(friendId) {
    const id = Number(friendId);
    if (!this.friends.includes(id)) {
      this.friends.push(id);
    }
  }

  removeFriend(friendId) {
    const id = Number(friendId);
    this.friends = this.friends.filter((fId) => fId !== id);
  }

  get friendCount() {
    return this.friends.length;
  }
}

export function groupUsersByFriendCount(users) {
  const result = new Map();
  for (const user of users) {
    const count = Number(user.friendCount);
    if (!result.has(count)) {
      result.set(count, []);
    }
    result.get(count).push(user);
  }
  return result;
}

export function getUniqueFriends(users) {
  const set = new Set();
  for (const user of users) {
    for (const fId of user.friends) {
      set.add(fId);
    }
  }
  return Array.from(set);
}

export function findUsersWithFriend(users, friendId) {
  const targetId = Number(friendId);
  return users.filter((user) => user.friends.includes(targetId));
}

export function findUsersAboveFriendCount(users, minFriends) {
  const threshold = Number(minFriends);
  return users.filter((user) => user.friendCount > threshold);
}

export function findUsersWithoutFriends(users) {
  return users.filter((user) => user.friendCount === 0);
}
