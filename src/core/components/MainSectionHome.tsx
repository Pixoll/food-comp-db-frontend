import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Form } from "react-bootstrap";
import {useTranslation} from "react-i18next";
import background from "../../../public/main_page_bg.jpg";

export default function MainSectionHome() {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const [foodName, setFoodName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (foodName.trim()) {
            toSearchPage(foodName);
        }
    };

    const toSearchPage = (foodName: string) => {
        const trimmedName = foodName.trim();
        navigate('/search', {state: {foodName: trimmedName}});
    };
    return (
        <div
            // bg image obtained from https://www.pexels.com/photo/assorted-vegetables-on-brown-surface-616404/
            // marked as free to use by the photographe
            style={{
                backgroundImage: `url(${background.src}), radial-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%)`
            }}
            className={`
        bg-blend-overlay
        bg-cover
        bg-center
        h-screen
        text-white
        text-center
        `}
        >
            <div className="container mx-auto px-4 h-full">
                <div className="h-full flex justify-center items-center">
                    <div>
                        <h1
                            className="
                            font-bold
                            text-5xl text-shadow-lg
                            text-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]
                            font-[Poppins,_sans-serif]
                            "
                        >
                            {t("homepage.title")}
                        </h1>
                        <p
                            className="
                            text-5xl
                            mb-[30px]
                            text-shadow-[2px_2px_8px_rgba(0,0,0,0.7)]
                            font-[Poppins,_sans-serif]
                            "
                        >
                            {t("homepage.subtitle")}
                        </p>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group
                                className="d-flex"
                                style={{maxWidth: "600px", margin: "0 auto"}}
                            >
                                <Form.Control
                                    type="text"
                                    placeholder={t("search.placeholder")}
                                    value={foodName}
                                    onChange={(e) => setFoodName(e.target.value)}
                                    style={{
                                        padding: "15px",
                                        fontSize: "1.2rem",
                                        borderRadius: "30px 0 0 30px",
                                        border: "none",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="
                                    py-[15px]
                                    px-[30px]
                                    text-xl
                                    bg-[#28a740]
                                    border-[#28a745]
                                    rounded-r-[30px]
                                    "
                                >
                                    {t("search.button")}
                                </button>
                            </Form.Group>
                        </Form>

                        <div className="text-center mt-[20px]">
                            <button
                                className="
                                py-[10px]
                                px-[20px]
                                text-xl
                                bg-[#28a745]
                                text-white
                                border-none
                                rounded-[5px]
                                border-[#28a745]
                                "
                                onClick={() => navigate("/search")}
                            >
                                {t("search.advancedSearch")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
