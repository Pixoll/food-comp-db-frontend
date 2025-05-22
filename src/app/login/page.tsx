'use client'
import { BiLogIn } from "react-icons/bi";
import { FaLock, FaUserCircle } from "react-icons/fa";
import {useRouter} from "next/navigation";
import makeRequest from "../../core/utils/makeRequest";
import {useForm} from "../../core/hooks";
import {useAuth} from "../../core/context/AuthContext";
import { useTranslation } from "react-i18next";
import {FormEvent} from "react";
type LoginForm = {
    username: string;
    password: string;
}
export default function LoginPage() {

    const { t } = useTranslation();
    const { login } = useAuth();
    const router = useRouter();

    const { formState, onInputChange, onResetForm } = useForm<LoginForm>({
        username: "",
        password: ""
    });
    const validateUsername = (username: string): boolean => {
        const regex = /^[A-Za-z0-9_]{8,32}$/;
        return regex.test(username);
    };
    const onLogin = (e: FormEvent) => {
        e.preventDefault();

        makeRequest("post", `/admins/${formState.username}/session`, {
            payload: {
                password: formState.password,
            },
            successCallback: (response) => {
                const token = response.data.token as string;
                login(token, formState.username);

                onResetForm();
                router.push("/");
            },
            errorCallback: (error) => {
                console.error(t("loginPage.errors.login"), error);

                if (error.response) {
                    console.error(t("loginPage.errors.response"), error.response.data);
                    console.error(t("loginPage.errors.state"), error.response.status);
                } else if (error.request) {
                    console.error(t("loginPage.errors.received"), error.request);
                } else {
                    console.error(t("loginPage.errors.unknown"), error.message);
                }
            },
        });
    };
    return (

        <div className="flex flex-row h-full justify-center items-center">
            <div className="
                    flex
                    flex-col
                    justify-start
                    items-center
                    text-white
                    w-[450px]
                    h-[500px]
                    p-[40px]
                    rounded-[10px]
                    shadow-[10px_10px_15px_rgba(0,0,0,0.05)]
                    bg-[rgba(255,255,255,0.25)]
                    backdrop-blur-[20px]
                    font-['Poppins',sans-serif]
                    [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)]
                    ">
                <h1 className="text-center mb-[20px] text-[24px] text-[white]">{t("loginPage.title")}</h1>
                <form onSubmit={onLogin} className="w-full">
                    <div className="
                        relative
                        border-b-[2px]
                        border-[#adadad]
                        my-[30px]
                        group
                        ">
                        <input
                            type="text"
                            name="username"
                            value={formState.username}
                            onChange={onInputChange}
                            required
                            className="
                                w-full
                                px-[5px]
                                h-[40px]
                                text-[16px]
                                border-none
                                bg-transparent
                                outline-none
                                text-[white]
                                peer
                            "
                        />
                        <span className="
                            absolute
                            top-[40px]
                            left-[0px]
                            w-[0px]
                            h-[2px]
                            bg-[#009000]
                            transition-all
                            duration-500
                            peer-focus:w-full
                            peer-valid:w-full
                        "></span>
                        <label className="
                            absolute
                            top-[50%]
                            left-[5px]
                            text-[white]
                            transform
                            -translate-y-[50%]
                            text-[16px]
                            pointer-events-none
                            transition-all
                            duration-500
                            flex
                            items-center
                            gap-[4px]
                            [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)]
                            peer-focus:-top-[5px]
                            peer-focus:text-[#009000]
                            peer-valid:-top-[5px]
                            peer-valid:text-[#009000]
                        ">
                            <FaUserCircle/> {t("loginPage.username")}
                        </label>
                    </div>
                    <div className="
                        relative
                        border-b-[2px]
                        border-[#adadad]
                        my-[30px]
                        group
                    ">
                        <input
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={onInputChange}
                            required
                            className="
                                w-full
                                px-[5px]
                                h-[40px]
                                text-[16px]
                                border-none
                                bg-transparent
                                outline-none
                                text-[white]
                                peer
                            "
                        />
                        <span className="
                            absolute
                            top-[40px]
                            left-[0px]
                            w-[0px]
                            h-[2px]
                            bg-[#009000]
                            transition-all
                            duration-500
                            peer-focus:w-full
                            peer-valid:w-full
                        "></span>
                        <label className="
                            absolute
                            top-1/2
                            left-[5px]
                            text-[white]
                            transform
                            -translate-y-1/2
                            text-[16px]
                            pointer-events-none
                            transition-all
                            duration-500
                            flex
                            items-center
                            gap-1
                            [text-shadow:2px_2px_4px_rgba(0,0,0,0.2)]
                            peer-focus:-top-[5px]
                            peer-focus:text-[#009000]
                            peer-valid:-top-[5px]
                            peer-valid:text-[#009000]
                        ">
                            <FaLock/> {t("loginPage.password")}
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="
                            w-full
                            h-[50px]
                            border-none
                            bg-[#28a745]
                            text-[white]
                            text-[18px]
                            font-[700]
                            rounded-[25px]
                            cursor-pointer
                            transition-all
                            duration-300
                            ease-in-out
                            hover:bg-[#218838]
                            hover:scale-105
                            focus:outline-none
                            flex
                            items-center
                            justify-center
                            gap-[8px]
                        "
                    >
                        <BiLogIn/>
                        {t("loginPage.title")}
                    </button>
                </form>
            </div>
        </div>

    )
}
