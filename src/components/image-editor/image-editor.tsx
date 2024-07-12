"use client"
import React, { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import diploma from './diploma.png'
import localFont from 'next/font/local'
import { Canvg } from 'canvg';
import { ModeToggle } from '../mode-toggle';

const eoeFont = localFont({
    src: [{ path: './OPTIEngraversOldEnglish.otf', weight: '400', style: 'normal' }],
})

export function ImageEditor() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [text, setText] = useState('Homelander');
    const [text2, setText2] = useState('In Engineering Science');
    const [fontSize, setFontSize] = useState(42);
    const [fontColor, setFontColor] = useState('#141538');
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
    const svgRef = useRef(null);

    const loadImage = (src: string) => {
        const img = new Image();
        img.onload = () => {
            setImage(img);
            setSvgSize({ width: img.width, height: img.height });
        };
        img.src = src;
    }

    // const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (!files) return;
    //     const file = files[0];
    //     const reader = new FileReader();

    //     reader.onload = (event) => {
    //         const result = event.target?.result;
    //         if (typeof result !== "string") return
    //         loadImage(result);

    //     };

    //     reader.readAsDataURL(file);
    // };


    // const drawImage = useCallback(() => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;
    //     const svg = svgRef.current;
    //     if (!svg) return;
    //     if (!image) return;
    //     const ctx = canvas.getContext('2d');
    //     if (!ctx) return;
    //     // canvas.width = image.width;
    //     // canvas.height = image.height;
    //     canvas.width = svgSize.width;
    //     canvas.height = svgSize.height;

    //     ctx.drawImage(image, 0, 0);

    //     // if (text) {
    //     //     const centerX = canvas.width / 2;
    //     //     const centerY = canvas.height / 2;
    //     //     ctx.font = `${fontSize}px ${fontFamily}`;
    //     //     ctx.fillStyle = fontColor;
    //     //     ctx.textAlign = 'center';
    //     //     ctx.textBaseline = 'middle';
    //     //     ctx.fillText(text, centerX, centerY);
    //     // }
    //     // }, [fontColor, fontFamily, fontSize, image, text]);
    // }, [image, svgSize.height, svgSize.width]);

    // const applyGrayscale = () => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;
    //     const ctx = canvas.getContext('2d');
    //     if (!ctx) return;
    //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //     const data = imageData.data;

    //     for (let i = 0; i < data.length; i += 4) {
    //         const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    //         data[i] = avg;     // Red
    //         data[i + 1] = avg; // Green
    //         data[i + 2] = avg; // Blue
    //     }

    //     ctx.putImageData(imageData, 0, 0);
    // };

    // const saveImage = () => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;
    //     const link = document.createElement('a');
    //     link.download = 'edited_image.png';
    //     link.href = canvas.toDataURL();
    //     link.click();
    // };
    // 
    const saveImage = async () => {
        const svg = svgRef.current;
        if (!svg) return;
        let svgData = new XMLSerializer().serializeToString(svg);
        const diplomaDataUrl = await getDataUrl(diploma.src)
        svgData = svgData.replace(new RegExp('href="[^"]+"'), `href="${diplomaDataUrl}"`);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();


        img.onload = async () => {
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;

            const v = await Canvg.from(ctx, img.src);
            await v.render()

            const link = document.createElement('a');
            link.download = 'edited_image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    useEffect(() => {
        loadImage(diploma.src);
    }, [])

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>I have Ph.D.</CardTitle>
                <ModeToggle />
            </CardHeader>
            <CardContent>
                {/* <img src={diploma.blurDataURL} alt="diploma" /> */}
                <div className="space-y-4">
                    {/* <div>
                        <Label htmlFor="imageUpload">Upload Image</Label>
                        <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} />
                    </div> */}
                    <div>
                        <Label htmlFor="textInput1">Text 1</Label>
                        <Input id="textInput1" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text 1" />
                        <Label htmlFor="textInput2">Text 2</Label>
                        <Input id="textInput2" type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Enter text 2" />
                    </div>
                    {/* <div className="grid grid-cols-3 gap-4">
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
                    </div> */}
                    <svg
                        ref={svgRef}
                        // width={svgSize.width}
                        // height={svgSize.height}
                        width="100%"
                        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
                        className="w-full border border-gray-300"
                    >
                        {image ? <image href={image.src} width="100%" height="100%" /> : null}
                        {text ? (
                            <text
                                x="50%"
                                y="320"
                                fontFamily={eoeFont.style.fontFamily}
                                fontSize={fontSize}
                                fill={fontColor}
                                fontWeight="800"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {text}
                            </text>
                        ) : null}
                        {text2 ? (
                            <text
                                x="50%"
                                y="485"
                                fontFamily={eoeFont.style.fontFamily}
                                fontSize={30}
                                fill={fontColor}
                                textAnchor="middle"
                                fontWeight="800"
                                dominantBaseline="middle"
                            >
                                {text2}
                            </text>
                        ) : null}
                    </svg>
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <div className="flex space-x-2">
                    {/* <Button onClick={applyGrayscale} disabled={!image}>Apply Grayscale</Button> */}
                    <Button onClick={saveImage} disabled={!image}>Save Image</Button>
                </div>
            </CardFooter>
        </Card>
    );
};

function getDataUrl(src: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = src;
    });
}
