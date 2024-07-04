import User from "../types/User";

export namespace UserUtils {
    export function setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    export function getUser(): User | undefined {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          try {
            const user: User = JSON.parse(userJson);
            return user;
          } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return undefined;
          }
        }
        return undefined;
      }
}