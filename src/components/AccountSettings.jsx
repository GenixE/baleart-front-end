import {useNavigate} from 'react-router-dom';
import {useLanguage} from "../contexts/LanguageContext.jsx";

export function AccountSettings() {
    const navigate = useNavigate();
    const {language} = useLanguage();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-semibold">{language === 'EN' ? 'Account' : language === 'ES' ? 'Mi cuenta' : 'El meu compte'}</h1>
            <h2 className="text-lg text-gray-600">{language === 'EN' ? 'Manage your account settings.' : language === 'ES' ? 'Administrar la configuración de su cuenta.' : 'Administrar la configuració del vostre compte.'}</h2>
            <div className="flex flex-row space-x-6 flex-nowrap">
                {/* Personal Info Section */}
                <button
                    onClick={() => navigate('/account-settings/personal-info')}
                    className="bg-white shadow rounded-lg p-6 text-left"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-10"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5m6-10.125a1.875 1.875 0 1 1-3.75 0a1.875 1.875 0 0 1 3.75 0m1.294 6.336a6.7 6.7 0 0 1-3.17.789a6.7 6.7 0 0 1-3.168-.789a3.376 3.376 0 0 1 6.338 0"
                        ></path>
                    </svg>

                    <h2 className="text-xl font-semibold mt-4">{language === 'EN' ? 'Personal Info' : language === 'ES' ? 'Información Personal' : 'Informació Personal'}</h2>
                    <p className="text-gray-600">{language === 'EN' ? 'Provide personal details and how we can reach you.' : language === 'ES' ? 'Proporcionar detalles personales y cómo podemos comunicarnos con usted.' : 'Proporcionar detalls personals i com podem contactar amb vosaltres.'}</p>
                </button>

                {/* Login & Security Section */}
                <button
                    onClick={() => navigate('/account-settings/login-and-security')}
                    className="bg-white shadow rounded-lg p-6 text-left"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        className="size-10"
                    >
                        <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                d="M7.36 13.43h0a1 1 0 0 1-.72 0h0a9.67 9.67 0 0 1-6.14-9V1.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2.92a9.67 9.67 0 0 1-6.14 9.01Z"></path>
                            <rect width="5" height="4" x="4.5" y="5.5" rx="1"></rect>
                            <path d="M8.5 5.5v-1a1.5 1.5 0 1 0-3 0v1"></path>
                        </g>
                    </svg>

                    <h2 className="text-xl font-semibold mt-4">{language === 'EN' ? 'Login & Security' : language === 'ES' ? 'Inicio de sesión y seguridad' : 'Inici de sessió i seguretat'}</h2>
                    <p className="text-gray-600">{language === 'EN' ? 'Update your password and secure your account.' : language === 'ES' ? 'Actualizar su contraseña y asegure su cuenta.' : 'Actualitzar la vostra contrasenya i assegureu el vostre compte.'}</p>
                </button>
            </div>
        </div>
    );
}