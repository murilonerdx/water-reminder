import './App.css'
import WaterReminder from "./WaterReminder";
import React, {useEffect, useState} from "react";
import {toast, Toaster} from "react-hot-toast";
import sound from "@/assets/bell-notification-933.mp3";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Bell, Droplet, Minus, Music, Pause, Play, Plus, RotateCcw} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Input} from "@/components/ui/input";

function App() {


    const [interval, setInterval] = useState(60)
    const [timeLeft, setTimeLeft] = useState(interval * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [waterConsumed, setWaterConsumed] = useState(0)
    const [customAmount, setCustomAmount] = useState(250)
    const dailyGoal = 2000 // 2 litros

    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        setTimeLeft(interval * 60)
    }, [interval])

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isRunning && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            notifyUser()
            setTimeLeft(interval * 60)
        }

        return () => clearTimeout(timer)
    }, [isRunning, timeLeft, interval])

    const notifyUser = () => {
        // Exibir notificação
        if ("Notification" in window && Notification.permission === "granted") {


            new Notification("Lembrete de Água", {
                body: "Está na hora de beber água!",
                icon: "/placeholder.svg?height=64&width=64"
            });
        }
        // Tocar o som
        handlePlayAudio()
        // Mostrar toast
        toast("Está na hora de beber água!", {
            icon: "💧",
        });
    };


    const handlePlayAudio = () => {
        console.log('Tentando tocar o áudio...');
        const audio = new Audio(sound);
        audio.play().then(() => {
            console.log('Áudio tocado com sucesso!');
        }).catch((error) => {
            console.log('Erro ao tentar tocar áudio:', error);
        });
    };

    const toggleTimer = () => setIsRunning(!isRunning)
    const resetTimer = () => {
        setTimeLeft(interval * 60)
        if (!isRunning) {
            setIsRunning(false)
        }
    }

    const addWater = (amount: number) => {
        setWaterConsumed(Math.min(waterConsumed + amount, dailyGoal))
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-blue-600">Hidrate-se</h2>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                if ("Notification" in window) {
                                    Notification.requestPermission().then((permission) => {
                                        if (permission === "granted") {
                                            toast.success("Notificações ativadas!");
                                        } else {
                                            toast.error("Permissão de notificação negada");
                                        }
                                    });
                                } else {
                                    toast.error("Seu navegador não suporta notificações");
                                }
                            }}
                            title="Ativar notificações"
                        >
                            <Bell className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Próximo lembrete</span>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const newInterval = Math.max(1, interval - 5);
                                        setInterval(newInterval);
                                        setTimeLeft(newInterval * 60);
                                    }}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">{interval}min</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const newInterval = interval + 5;
                                        setInterval(newInterval);
                                        setTimeLeft(newInterval * 60);
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <Progress value={(timeLeft / (interval * 60)) * 100} className="h-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                            <div className="space-x-2">
                                <Button variant="outline" size="icon" onClick={toggleTimer}>
                                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button variant="outline" size="icon" onClick={resetTimer}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>

                                <Button variant="outline" size="icon" onClick={handlePlayAudio}>
                                    <Music className="h-4 w-4" />
                                </Button>

                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Água consumida</span>
                            <span className="text-sm font-medium">{waterConsumed} / {dailyGoal}ml</span>
                        </div>
                        <Progress value={(waterConsumed / dailyGoal) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={customAmount}
                            onChange={(e: any) => setCustomAmount(Number(e.target.value))}
                            className="w-20"
                            min="1"
                        />
                        <span className="text-sm">ml</span>
                        <Button onClick={() => addWater(customAmount)} className="flex-grow">
                            <Droplet className="mr-2 h-4 w-4" /> Adicionar água
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Toaster />
        </div>
  )
}

export default App
