import { useNavigate } from 'react-router-dom';

const Button = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/search");
    };
    return (
        <button className='button-home' onClick={handleClick}>Buscar Composición</button>
    );
};

export default Button;
