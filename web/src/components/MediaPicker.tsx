"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

export function MediaPicker() {
    const [preview, setPreview] = useState<string | null>(null);

    function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target;

        if (!files) return;

        const previewURL = URL.createObjectURL(files[0]);
        console.log(URL.createObjectURL(event.target.files![0]));
        setPreview(previewURL);
    }

    return (
        <>
            <input
                id="media"
                type="file"
                name="coverUrl"
                className="invisible h-0 w-0"
                accept="image/*"
                onChange={onFileSelected}
            />
            {preview && (
                <Image
                    src={preview}
                    className="aspect-video h-[280px] w-full rounded-lg object-cover"
                    alt=""
                    width={180}
                    height={100}
                />
            )}
        </>
    );
}
