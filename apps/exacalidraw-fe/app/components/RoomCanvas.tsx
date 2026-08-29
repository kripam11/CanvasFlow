"use client";

import { useEffect, useRef, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const socketRef = useRef<WebSocket | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        console.log("TOKEN:", token);

        if (!token) {
            console.log("No token found. Please sign in first.");
            return;
        }

        const ws = new WebSocket(
            `${WS_URL}?token=${token}`
        );

        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WS OPEN");

            ws.send(
                JSON.stringify({
                    type: "join_room",
                    roomId
                })
            );

            console.log("JOIN ROOM SENT:", roomId);

            setSocket(ws);
        };

        ws.onclose = (event) => {
            console.log("WS CLOSED");
            console.log("Code:", event.code);
            console.log("Reason:", event.reason);
        };

        ws.onerror = () => {
            console.log("WS ERROR");
        };

        return () => {
            console.log("ROOM CANVAS CLEANUP");

            if (
                ws.readyState === WebSocket.OPEN ||
                ws.readyState === WebSocket.CONNECTING
            ) {
                ws.close();
            }
        };
    }, [roomId]);

    if (!socket) {
        return <div>Connecting to Server...</div>;
    }

    return (
        <Canvas
            roomId={roomId}
            socket={socket}
        /> 
    );
}