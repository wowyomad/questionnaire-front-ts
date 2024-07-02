export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    return passwordRegex.test(password);
}

export function isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/u;
    return nameRegex.test(name);
}
export function isValidPhone(phone: string) {
    return phone.length >= 4
}

