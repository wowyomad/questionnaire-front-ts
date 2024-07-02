import { useState } from "react"
import { isValidEmail, isValidPassword } from "../services/ValidationUtils";
import { api } from "../services/api";
import AuthenticationResponse from "../types/AuthenticationResponse";
import UserLogin from "../types/UserLogin";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
    onLoginSuccess: (auth: AuthenticationResponse) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState<UserLogin>({ email: '', password: '' })
    const [error, setError] = useState<string>('')

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSignin = async () => {
        if (!isValidEmail(formData.email)) {
            setError('Invalid email')
            return
        }
        if (!isValidPassword(formData.password)) {
            setError('Invalid password')
            return;
        }
        let auth: AuthenticationResponse;
        try {
            auth = await api.login(formData)

        } catch (err: Error | any) {
            console.log('catched error')
            setError((err as Error).message)
            return;
        }
        await onLoginSuccess(auth)
    }

    return (
        <div className="container-sm mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 shadow-3-strong p-5 mb-5 rounded">
                    <div className="form-floating mb-4">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Email address</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="row mb-4">
                        <div className="col d-flex justify-content-center">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="remember" defaultChecked />
                                <label className="form-check-label" htmlFor="remember">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div className="col">
                            <a href="#!">Forgot password?</a>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                        <button onClick={handleSignin} type="button" className="btn btn-primary btn-lg ps-5 pe-5">
                            Sign in
                        </button>
                    </div>
                    <div className="text-center mb-5">
                        <span>
                            Not registered? <button onClick={() => navigate('/signup')} type="button" className="btn btn-link">Register</button>
                        </span>
                    </div>
                    <div className="text-danger">
                        {error}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;