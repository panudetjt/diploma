"use client"
import React, { useState, useRef, useEffect, ChangeEvent, useMemo, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export const ImageEditor = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [text, setText] = useState('');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(30);
    const [fontColor, setFontColor] = useState('#000000');
    const canvasRef = useRef<HTMLCanvasElement | null>(null);


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
            };
            const result = event.target?.result;
            if (typeof result !== "string") return
            img.src = result ?? '';
        };

        reader.readAsDataURL(file);
    };

    const drawImage = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!image) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        if (text) {
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        }
    }, [fontColor, fontFamily, fontSize, image, text]);

    const applyGrayscale = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;     // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }

        ctx.putImageData(imageData, 0, 0);
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'edited_image.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    useEffect(() => {
        if (!image) return
        drawImage();
    }, [drawImage, image]);


    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Image Editor with Custom Text</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="imageUpload">Upload Image</Label>
                        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <div>
                        <Label htmlFor="textInput">Custom Text</Label>
                        <Input id="textInput" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="fontFamily">Font Family</Label>
                            <Select value={fontFamily} onValueChange={setFontFamily}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Arial">Arial</SelectItem>
                                    <SelectItem value="Verdana">Verdana</SelectItem>
                                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                    <SelectItem value="Courier">Courier</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="fontSize">Font Size</Label>
                            <Input id="fontSize" type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min="1" max="100" />
                        </div>
                        <div>
                            <Label htmlFor="fontColor">Font Color</Label>
                            <Input id="fontColor" type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={applyGrayscale} disabled={!image}>Apply Grayscale</Button>
                        <Button onClick={saveImage} disabled={!image}>Save Image</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <canvas ref={canvasRef} className="w-full border border-gray-300" />
            </CardFooter>
        </Card>
    );
};
