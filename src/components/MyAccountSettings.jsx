import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { NavigationCard } from './NavigationCard';
import { PersonalInfoIcon, SecurityIcon } from './MyAccountIcons.jsx';
import { translations } from '../translations/translations';

export function MyAccountSettings() {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const getText = (path) => {
        return path[language] || path['EN'];
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-semibold">
                {getText(translations.accountSettings.account)}
            </h1>
            <h2 className="text-lg text-gray-600">
                {getText(translations.accountSettings.subtitle)}
            </h2>
            <div className="flex flex-row space-x-6 flex-nowrap">
                <NavigationCard
                    icon={<PersonalInfoIcon />}
                    title={getText(translations.personalInfo.title)}
                    description={getText(translations.personalInfo.description)}
                    onClick={() => navigate('/account-settings/personal-info')}
                />
                <NavigationCard
                    icon={<SecurityIcon />}
                    title={getText(translations.security.title)}
                    description={getText(translations.security.description)}
                    onClick={() => navigate('/account-settings/login-and-security')}
                />
            </div>
        </div>
    );
}