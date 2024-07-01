interface UserSignup {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
}
interface UserProfile extends UserSignup {
    
}

export default UserSignup;