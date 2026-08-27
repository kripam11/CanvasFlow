"use client";

import axios from "axios";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleAuth() {
        try {
            const response = await axios.post(
                `${HTTP_BACKEND}/${isSignin ? "signin" : "signup"}`,
                {
                    username,
                    password
                }
            );

            console.log("RESPONSE:", response.data);

            if (isSignin) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );

                console.log(
                    "TOKEN SAVED:",
                    localStorage.getItem("token")
                );
            }

        } catch (error: any) {
            console.error(
                "AUTH ERROR:",
                error.response?.data
            );

            console.error(
                "STATUS:",
                error.response?.status
            );
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="p-6 m-2 bg-white rounded">

                <div className="p-2">
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />
                </div>

                <div className="p-2">
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                <div className="pt-2">
                    <button onClick={handleAuth}>
                        {isSignin ? "Sign in" : "Sign up"}
                    </button>
                </div>

            </div>
        </div>
    );
}