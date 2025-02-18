import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from "../contexts/LanguageContext.jsx";
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, type }) => {
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
    const { language } = useLanguage();

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
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            if (newPassword !== newPasswordConfirmation) {
                setErrorMessage(
                    language === 'EN' ? "Passwords don't match!" :
                        language === 'ES' ? "¡Las contraseñas no coinciden!" :
                            "Les contrasenyes no coincideixen!"
                );
                return;
            }

            const response = await axios.post('http://localhost:8000/api/reset-password', {
                email: resetEmail,
                password: newPassword,
                password_confirmation: newPasswordConfirmation
            });

            alert(
                language === 'EN' ? 'Password reset successfully.' :
                    language === 'ES' ? 'Contraseña restablecida con éxito.' :
                        'Contrasenya restablida amb èxit.'
            );
            setIsForgotPasswordOpen(false);
            setResetEmail('');
            setNewPassword('');
            setNewPasswordConfirmation('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(
                error.response?.data?.message ||
                (language === 'EN' ? 'Error resetting password. Please check your inputs.' :
                    language === 'ES' ? 'Error al restablecer la contraseña. Por favor, verifica tus entradas.' :
                        'Error en restablir la contrasenya. Si us plau, verifica les teves entrades.')
            );
        }
    };

    if (!isOpen) return null;

    return (
        <StyledWrapper>
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
                <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm max-h-6/7 overflow-y-auto">
                    <header className="flex justify-between items-center">
                        <p className="title">
                            {type === 'login' ?
                                (language === 'EN' ? 'Login' : language === 'ES' ? 'Iniciar sesión' : 'Iniciar sessió') :
                                (language === 'EN' ? 'Register' : language === 'ES' ? 'Registrarse' : 'Registrar-se')
                            }
                        </p>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {errorMessage}
                        </div>
                    )}
                    <form className="form" onSubmit={handleSubmit}>
                        <p className="message">
                            {type === 'register' &&
                                (language === 'EN' ? 'Sign up to get full access to our app.' :
                                    language === 'ES' ? 'Regístrate para obtener acceso completo a nuestra aplicación.' :
                                        'Registra\'t per obtenir accés complet a la nostra aplicació.')
                            }
                        </p>
                        {type === 'register' && (
                            <>
                                <label>
                                    <input required type="text" value={name}
                                           onChange={(e) => setName(e.target.value)} className="input" />
                                    <span>
                                        {language === 'EN' ? 'Firstname' : language === 'ES' ? 'Nombre' : 'Nom'}
                                    </span>
                                </label>
                                <label>
                                    <input required type="text" value={lastName}
                                           onChange={(e) => setLastName(e.target.value)} className="input" />
                                    <span>
                                        {language === 'EN' ? 'Lastname' : language === 'ES' ? 'Apellido' : 'Cognom'}
                                    </span>
                                </label>
                                <label>
                                    <input required type="tel" value={phone}
                                           onChange={(e) => setPhone(e.target.value)} className="input" />
                                    <span>
                                        {language === 'EN' ? 'Phone number' : language === 'ES' ? 'Número de teléfono' : 'Número de telèfon'}
                                    </span>
                                </label>
                            </>
                        )}
                        <label>
                            <input required type="email" value={email}
                                   onChange={(e) => setEmail(e.target.value)} className="input" />
                            <span>
                                {language === 'EN' ? 'Email' : language === 'ES' ? 'Correo electrónico' : 'Correu electrònic'}
                            </span>
                        </label>
                        <label>
                            <input required type="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} className="input" />
                            <span>
                                {language === 'EN' ? 'Password' : language === 'ES' ? 'Contraseña' : 'Contrasenya'}
                            </span>
                        </label>
                        {type === 'register' && (
                            <label>
                                <input required type="password"
                                       value={passwordConfirmation}
                                       onChange={(e) => setPasswordConfirmation(e.target.value)} className="input" />
                                <span>
                                    {language === 'EN' ? 'Confirm password' : language === 'ES' ? 'Confirmar contraseña' : 'Confirmar contrasenya'}
                                </span>
                            </label>
                        )}
                        <button type="submit" className="submit">
                            {type === 'login' ?
                                (language === 'EN' ? 'Login' : language === 'ES' ? 'Iniciar sesión' : 'Iniciar sessió') :
                                (language === 'EN' ? 'Register' : language === 'ES' ? 'Registrarse' : 'Registrar-se')
                            }
                        </button>
                        {type === 'login' && (
                            <p className="text-center mt-4">
                                <a href="#" onClick={() => setIsForgotPasswordOpen(true)}
                                   className="text-[#149d80] hover:text-[#0f7a63]">
                                    {language === 'EN' ? 'Forgot Password?' : language === 'ES' ? '¿Olvidaste tu contraseña?' : 'Has oblidat la contrasenya?'}
                                </a>
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {isForgotPasswordOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm max-h-6/7 overflow-y-auto">
                        <header className="flex justify-between items-center">
                            <p className="title">
                                {language === 'EN' ? 'Reset Password' : language === 'ES' ? 'Restablecer contraseña' : 'Restablir contrasenya'}
                            </p>
                            <button onClick={() => setIsForgotPasswordOpen(false)}
                                    className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </header>
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <form className="form" onSubmit={handleForgotPasswordSubmit}>
                            <label>
                                <input required type="email" value={resetEmail}
                                       onChange={(e) => setResetEmail(e.target.value)} className="input" />
                                <span>
                                    {language === 'EN' ? 'Email' : language === 'ES' ? 'Correo electrónico' : 'Correu electrònic'}
                                </span>
                            </label>
                            <label>
                                <input required type="password" value={newPassword}
                                       onChange={(e) => setNewPassword(e.target.value)} className="input" />
                                <span>
                                    {language === 'EN' ? 'New Password' : language === 'ES' ? 'Nueva contraseña' : 'Nova contrasenya'}
                                </span>
                            </label>
                            <label>
                                <input required type="password" value={newPasswordConfirmation}
                                       onChange={(e) => setNewPasswordConfirmation(e.target.value)} className="input" />
                                <span>
                                    {language === 'EN' ? 'Confirm New Password' : language === 'ES' ? 'Confirmar nueva contraseña' : 'Confirmar nova contrasenya'}
                                </span>
                            </label>
                            <button type="submit" className="submit">
                                {language === 'EN' ? 'Reset Password' : language === 'ES' ? 'Restablecer contraseña' : 'Restablir contrasenya'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
        background-color: #fff;
        padding: 20px;
        border-radius: 20px;
        position: relative;
    }

    .title {
        font-size: 28px;
        color: #149d80;
        font-weight: 600;
        letter-spacing: -1px;
        position: relative;
        display: flex;
        align-items: center;
        padding-left: 30px;
    }

    .title::before, .title::after {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        border-radius: 50%;
        left: 0px;
        background-color: #149d80;
    }

    .title::before {
        width: 18px;
        height: 18px;
        background-color: #149d80;
    }

    .title::after {
        width: 18px;
        height: 18px;
        animation: pulse 1s linear infinite;
    }

    .message, .signin {
        color: rgba(88, 87, 87, 0.822);
        font-size: 14px;
    }

    .signin {
        text-align: center;
    }

    .signin a {
        color: #149d80;
    }

    .signin a:hover {
        text-decoration: underline #149d80;
    }

    .flex {
        display: flex;
        width: 100%;
        gap: 6px;
    }

    .form label {
        position: relative;
    }

    .form label .input {
        width: 100%;
        padding: 10px 10px 20px 10px;
        outline: 0;
        border: 1px solid rgba(105, 105, 105, 0.397);
        border-radius: 10px;
    }

    .form label .input + span {
        position: absolute;
        left: 10px;
        top: 15px;
        color: grey;
        font-size: 0.9em;
        cursor: text;
        transition: 0.3s ease;
    }

    .form label .input:placeholder-shown + span {
        top: 15px;
        font-size: 0.9em;
    }

    .form label .input:focus + span, .form label .input:valid + span {
        top: 30px;
        font-size: 0.7em;
        font-weight: 600;
    }

    .form label .input:valid + span {
        color: green;
    }

    .submit {
        border: none;
        outline: none;
        background-color: #149d80;
        padding: 10px;
        border-radius: 10px;
        color: #fff;
        font-size: 16px;
        transition: .3s ease;
    }

    .submit:hover {
        background-color: rgb(56, 90, 194);
    }

    @keyframes pulse {
        from {
            transform: scale(0.9);
            opacity: 1;
        }

        to {
            transform: scale(1.8);
            opacity: 0;
        }
    }`;

export default AuthModal;