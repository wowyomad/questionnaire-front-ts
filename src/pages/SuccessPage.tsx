import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        const fromSubmission = sessionStorage.getItem('fromSubmission');
        if (!fromSubmission) {
            navigate('/submission');
        }
        sessionStorage.removeItem('fromSubmission');
    }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/responses');
        }, 3000);

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000); 

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [navigate]);

    return (
        <div>
            <h2>Success</h2>
            <h1>Submission sent successfully!</h1>
            <p>Redirecting to Responses in {seconds} seconds</p>
        </div>
    );
};

export default SuccessPage;
