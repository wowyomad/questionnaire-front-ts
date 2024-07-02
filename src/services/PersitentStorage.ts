namespace persistentStorage {
    export function setToken(token: string) {
        localStorage.setItem('token', token)
    }
    export function setUserId(userId: number) {

        localStorage.setItem('userId', userId.toString())
    }

    export function getToken(): string | undefined {
        
        return localStorage.getItem('token') ?? undefined
    }

    export function getUserId(): number | undefined {
        const userIdString = localStorage.getItem('userId');
        
        if (userIdString) {
            const userIdNumber = parseInt(userIdString, 10);
    
            if (!isNaN(userIdNumber)) {
                return userIdNumber;
            } else {
                return undefined; 
            }
        } else {
            return undefined;
        }
    }

    export function removeToken(): void {
        localStorage.removeItem('token')
    }

    export function removeUserId(): void {
        localStorage.removeItem('userId')
    }
}

export default persistentStorage;