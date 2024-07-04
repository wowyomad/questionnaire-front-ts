import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { isValidEmail, isValidName, isValidPhone } from "../services/ValidationUtils";
import AuthenticationResponse from "../types/AuthenticationResponse";
import User from "../types/User";

interface EditProfilePageProps {
    onSuccess: (auth: AuthenticationResponse) => Promise<void>;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState<User>({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await api.getCurrentUser();
                setFormData({
                    email: userProfile.email,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    phone: userProfile.phone,
                });
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (!isValidEmail(formData.email)) {
            setError('Invalid email');
            return;
        }
        if (!isValidName(formData.firstName)) {
            setError('Invalid first name');
            return;
        }
        if (!isValidName(formData.lastName)) {
            setError('Invalid last name');
            return;
        }
        if (!isValidPhone(formData.phone)) {
            setError('Invalid phone');
            return;
        }

        let auth: AuthenticationResponse;
        try {
            auth = await api.updateCurrentUser(formData);
        } catch (err: Error | any) {
            console.log('Caught error:', err);
            setError((err as Error).message);
            return;
        }
        await onSuccess(auth);
        alert('Profile updated successfully!');
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
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="name@example.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <label htmlFor="email">Email address</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                placeholder="John"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <label htmlFor="firstname">First Name</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                placeholder="Doe"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <label htmlFor="lastname">Last Name</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                placeholder="+1 (555) 555-1212"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <label htmlFor="phone">Phone Number</label>
                        </div>

                        <div className="d-flex justify-content-center mb-4">
                            <button onClick={handleUpdateProfile} type="button" className="btn btn-primary btn-lg ps-5 pe-5">
                                Update Profile
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

export default EditProfilePage;
