import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { isValidPassword } from "../services/ValidationUtils";
import AuthenticationResponse from "../types/AuthenticationResponse";

interface ChangePasswordPageProps {
    onSuccess: (auth: AuthenticationResponse) => Promise<void>;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (!isValidPassword(formData.newPassword)) {
            setError('Invalid new password');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const auth: AuthenticationResponse = await api.updateCurrentPassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            });
            await onSuccess(auth);
            alert('Password changed successfully!');
        } catch (err: Error | any) {
            console.log('Caught error:', err);
            setError((err as Error).message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container-sm mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form className="shadow-3-strong p-5 mb-5 rounded" action="#!">
                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="oldPassword"
                                placeholder="Old Password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                            />
                            <label htmlFor="oldPassword">Old Password</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                placeholder="New Password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            <label htmlFor="newPassword">New Password</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm New Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                        </div>

                        <div className="d-flex justify-content-center mb-4">
                            <button onClick={handleChangePassword} type="button" className="btn btn-primary btn-lg ps-5 pe-5">
                                Change Password
                            </button>
                        </div>

                        <div className="text-center mb-5">
                            <button onClick={() => navigate('/')} type="button" className="btn btn-link">Back to Home</button>
                        </div>
                        <div className="text-danger">{error}</div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
