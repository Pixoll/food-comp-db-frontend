import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Button = () => {
    const {t} = useTranslation("global");
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/search");
    };
    return (
        <button className='button-home' onClick={handleClick}>{t('components_home.title')}</button>
    );
};

export default Button;
