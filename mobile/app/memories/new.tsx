import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    TextInput,
    ScrollView,
    GestureResponderEvent,
    Image,
} from "react-native";
import NlwSpaceTime from "../../src/assets/nlw-spacetime-logo.svg";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { getItemAsync } from "expo-secure-store";
import { api } from "../../src/lib/api";

export default function NewMemory() {
    const { bottom, top } = useSafeAreaInsets();
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");

    async function openImagePicker() {
        try {
            let result = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                quality: 1,
                selectionLimit: 1,
            });

            if (result.assets[0]) {
                setPreview(result.assets[0].uri);
            }
        } catch (err) {
            // if (!result.canceled) {
            //     setImage(result.assets[0].uri);
            // }
        }
    }

    async function handleCreateMemory(event: GestureResponderEvent) {
        const token = await getItemAsync("token");
        let coverUrl: string;

        if (preview) {
            const uploadFormData = new FormData();

            uploadFormData.append("file", {
                uri: preview,
                name: "image.jpg",
                type: "image/jpeg",
            } as any);

            const uploadResponse = await api.post("/upload", uploadFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            coverUrl = uploadResponse.data.fileUrl;
        }

        await api.post(
            "/memories",
            {
                coverUrl,
                content,
                isPublic,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        router.push("/memories");
    }

    return (
        <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
        >
            <View className="mt-4 flex-row items-center justify-between">
                <NlwSpaceTime />
                <Link href="/memories" asChild>
                    <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                        <Icon name="arrow-left" size={16} color="#FFF" />
                    </TouchableOpacity>
                </Link>
            </View>
            <View className="mt-6 space-y-6">
                <View className="flex-row items-center gap-2">
                    <Switch
                        value={isPublic}
                        onValueChange={setIsPublic}
                        trackColor={{ false: "#767577", true: "#372560" }}
                        thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"}
                    />
                    <Text className="font-body text-base text-gray-200">
                        Tornar memória pública
                    </Text>
                </View>
                <TouchableOpacity
                    className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
                    onPress={openImagePicker}
                    activeOpacity={0.7}
                >
                    {preview ? (
                        <Image
                            source={{
                                uri: preview,
                            }}
                            className="h-full w-full rounded-lg object-cover"
                        />
                    ) : (
                        <View className="flex-row items-center gap-2">
                            <Icon name="image" color="#FFF" />
                            <Text className="font-body text-sm text-gray-200">
                                Adicionar foto ou video de capa
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TextInput
                    multiline
                    className="p-0 font-body text-lg text-gray-50"
                    value={content}
                    textAlignVertical="top"
                    onChangeText={(value) => setContent(value)}
                    placeholderTextColor="#56565a"
                    placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência"
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="items-center self-end rounded-full bg-green-500 px-5 py-2"
                    onPress={handleCreateMemory}
                >
                    <Text className="font-alt text-sm uppercase text-black">
                        Salvar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
