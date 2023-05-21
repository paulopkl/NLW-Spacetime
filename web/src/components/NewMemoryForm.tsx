"use client";

import { Camera } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";

export function NewMemoryForm() {
    // const cookies = cookies(); // Doesn't works in "client" components
    const router = useRouter();

    async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // console.log(event.currentTarget);

        const formData = new FormData(event.currentTarget);
        const fileToUpload = formData.get("coverUrl");
        let coverUrl = "";
        if (fileToUpload) {
            const uploadFormData = new FormData();
            uploadFormData.set("file", fileToUpload);
            // console.log(Array.from(formData.entries()));
            const uploadResponse = await api.post("/upload", uploadFormData);
            // console.log(uploadResponse.data);
            coverUrl = uploadResponse.data.fileUrl;
        }

        const token = cookie.get("token");

        await api.post(
            "/memories",
            {
                content: formData.get("content"),
                isPublic: formData.get("isPublic"),
                coverUrl,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        router.push("/");
    }

    return (
        <form
            onSubmit={handleCreateMemory}
            className="flex flex-1 flex-col gap-2"
        >
            <div className="flex items-center gap-4">
                <label
                    htmlFor="media"
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                    <Camera className="h-4 w-4" />
                    Anexar mídia
                </label>
                <label
                    htmlFor="isPublic"
                    className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
                >
                    <input
                        id="isPublic"
                        type="checkbox"
                        name="isPublic"
                        value={"true"}
                        className="h4 border-400 w-4 rounded bg-gray-700 text-purple-500"
                    />
                    Tornar memória pública
                </label>
            </div>
            <MediaPicker />
            <textarea
                name="content"
                spellCheck={false}
                className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
                placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
            />
            <button
                type="submit"
                className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
            >
                Salvar
            </button>
        </form>
    );
}
