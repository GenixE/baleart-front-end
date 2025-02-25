import {useEffect, useState} from 'react';
import {useLanguage} from '../contexts/LanguageContext.jsx';
import axios from 'axios';
import {translations} from '../translations/translations';
import {StyledWrapper} from '../styles/AuthModal.styles';

const AuthModal = ({isOpen, onClose, type}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {language} = useLanguage();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const url = type === 'login' ? 'http://localhost:8000/api/login' : 'http://localhost:8000/api/register';
        const data = type === 'login' ? { email, password } : {
            name,
            lastName,
            email,
            password,
            password_confirmation: passwordConfirmation,
            phone
        };

        try {
            const response = await axios.post(url, data);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('email', email);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);

            // Handle specific errors from the API response
            if (error.response?.data?.message) {
                // Translate specific error messages using switch-case
                let translatedErrorMessage;
                switch (error.response.data.message) {
                    case "The provided credentials are incorrect.":
                        translatedErrorMessage = translations.authModal.wrongCredentials[language]; // Use the selected language
                        break;
                    case "The password field confirmation does not match.":
                        translatedErrorMessage = translations.authModal.passwordsDontMatch[language]; // Use the selected language
                        break;
                    case "The email has already been taken.":
                        translatedErrorMessage = translations.authModal.emailTaken[language]; // Use the selected language
                        break;
                    case "The password field must be at least 8 characters.":
                        translatedErrorMessage = translations.authModal.mustbeatleast[language]; // Use the selected language
                        break;
                    default:
                        translatedErrorMessage = error.response.data.message; // Fallback to the original message
                        break;
                }

                setErrorMessage(translatedErrorMessage || translations.authModal.passwordResetError[language]);
            } else if (error.response?.data?.errors) {
                // Handle errors in the `errors` object (if applicable)
                const firstErrorKey = Object.keys(error.response.data.errors)[0]; // Get the first key (e.g., 'password')
                const firstErrorMessage = error.response.data.errors[firstErrorKey][0]; // Get the first error message for that key

                // Translate specific error messages using switch-case
                let translatedErrorMessage;
                switch (firstErrorMessage) {
                    case "The password field confirmation does not match.":
                        translatedErrorMessage = translations.authModal.passwordsDontMatch[language]; // Use the selected language
                        break;
                    case "The email has already been taken.":
                        translatedErrorMessage = translations.authModal.emailTaken[language]; // Use the selected language
                        break;
                    case "The password field must be at least 8 characters.":
                        translatedErrorMessage = translations.authModal.mustbeatleast[language]; // Use the selected language
                        break;
                    default:
                        translatedErrorMessage = firstErrorMessage; // Fallback to the original message
                        break;
                }

                setErrorMessage(translatedErrorMessage || translations.authModal.passwordResetError[language]);
            } else {
                // Fallback to a generic error message
                setErrorMessage(translations.authModal.passwordResetError[language]);
            }
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            if (newPassword !== newPasswordConfirmation) {
                setErrorMessage(translations.authModal.passwordsDontMatch[language]);
                return;
            }

            const response = await axios.post('http://localhost:8000/api/reset-password', {
                email: resetEmail,
                password: newPassword,
                password_confirmation: newPasswordConfirmation
            });

            alert(translations.authModal.passwordResetSuccess[language]);
            setIsForgotPasswordOpen(false);
            setResetEmail('');
            setNewPassword('');
            setNewPasswordConfirmation('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.response?.data?.message || translations.authModal.passwordResetError[language]);
        }
    };

    if (!isOpen) return null;

    return (
        <StyledWrapper>
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg max-h-6/7 overflow-y-auto">
                    <header className="flex justify-between items-center">
                        <p className="title">
                            {type === 'login' ? translations.authModal.login[language] : translations.authModal.register[language]}
                        </p>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </header>
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                            {errorMessage}
                        </div>
                    )}
                    <form className="form" onSubmit={handleSubmit}>
                        <p className="message">
                            {type === 'register' && translations.authModal.signUpMessage[language]}
                        </p>
                        {type === 'register' && (
                            <>
                                <div className="flex">
                                    <label>
                                        <input required type="text" value={name}
                                               onChange={(e) => setName(e.target.value)} className="input"/>
                                        <span>{translations.personalInfo.firstName[language]}</span>
                                    </label>
                                    <label>
                                        <input required type="text" value={lastName}
                                               onChange={(e) => setLastName(e.target.value)} className="input"/>
                                        <span>{translations.personalInfo.lastName[language]}</span>
                                    </label>
                                </div>
                                <label>
                                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                           className="input"/>
                                    <span>{translations.personalInfo.phoneNumber[language]}</span>
                                </label>
                            </>
                        )}
                        <label>
                            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                   className="input"/>
                            <span>{translations.personalInfo.email[language]}</span>
                        </label>
                        <label>
                            <input required type="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} className="input"/>
                            <span>{translations.security.password[language]}</span>
                        </label>
                        {type === 'register' && (
                            <label>
                                <input required type="password" value={passwordConfirmation}
                                       onChange={(e) => setPasswordConfirmation(e.target.value)} className="input"/>
                                <span>{translations.security.confirmNewPassword[language]}</span>
                            </label>
                        )}
                        <button type="submit" className="submit">
                            {type === 'login' ? translations.authModal.login[language] : translations.authModal.register[language]}
                        </button>
                        {type === 'login' && (
                            <p className="text-center mt-4">
                                <a href="#" onClick={() => setIsForgotPasswordOpen(true)}
                                   className="text-[#149d80] hover:text-[#0f7a63]">
                                    {translations.authModal.forgotPassword[language]}
                                </a>
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {isForgotPasswordOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg max-h-6/7 overflow-y-auto">
                        <header className="flex justify-between items-center">
                            <p className="title">
                                {translations.authModal.resetPassword[language]}
                            </p>
                            <button onClick={() => setIsForgotPasswordOpen(false)}
                                    className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </header>
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2">
                                {errorMessage}
                            </div>
                        )}
                        <form className="form" onSubmit={handleForgotPasswordSubmit}>
                            <label>
                                <input required type="email" value={resetEmail}
                                       onChange={(e) => setResetEmail(e.target.value)} className="input"/>
                                <span>{translations.personalInfo.email[language]}</span>
                            </label>
                            <label>
                                <input required type="password" value={newPassword}
                                       onChange={(e) => setNewPassword(e.target.value)} className="input"/>
                                <span>{translations.authModal.newPassword[language]}</span>
                            </label>
                            <label>
                                <input required type="password" value={newPasswordConfirmation}
                                       onChange={(e) => setNewPasswordConfirmation(e.target.value)} className="input"/>
                                <span>{translations.authModal.confirmNewPassword[language]}</span>
                            </label>
                            <button type="submit" className="submit">
                                {translations.authModal.resetPassword[language]}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </StyledWrapper>
    );
};
export default AuthModal;