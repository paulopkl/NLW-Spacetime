import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import NlwSpaceTime from "../../src/assets/nlw-spacetime-logo.svg";
import { useEffect, useState } from "react";
import { api } from "../../src/lib/api";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";

dayjs.locale(ptBr);

interface Memory {
    id: string;
    coverUrl: string;
    excerpt: string;
    createdAt: string;
}

export default function Memories() {
    const { bottom, top } = useSafeAreaInsets();
    const router = useRouter();
    const [memories, setMemories] = useState<Memory[]>([]);

    async function signOut() {
        await deleteItemAsync("token");

        router.push("/index");
    }

    useEffect(() => {
        (async () => {
            const token = await getItemAsync("token");

            const { data } = await api.get("/memories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMemories(data);
        })();
    }, []);

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
        >
            <View className="mt-4 flex-row items-center justify-between">
                <NlwSpaceTime />
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={signOut}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <Icon name="log-out" />
                    </TouchableOpacity>
                    <Link href="/new" asChild>
                        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
                            <Icon name="plus" size={16} color="#000" />
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
            <View className="mt-6 space-y-10">
                {memories.map((memory, key) => (
                    <View key={memory.id} className="space-y-4">
                        <View className="flex-row items-center gap-2">
                            <View className="h-px w-5 bg-gray-50" />
                            <Text className="font-body text-xs text-gray-100">
                                {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
                            </Text>
                        </View>
                        <View className="space-y-4 px-8">
                            <Image
                                source={{ uri: memory.coverUrl }}
                                className="aspect-video w-full rounded-lg"
                                alt=""
                            />
                            <Text className="font-body text-base leading-relaxed text-gray-100">
                                {memory.excerpt}
                            </Text>
                            <Link
                                href="/memories/id"
                                className="flex-row items-center gap-2"
                                asChild
                            >
                                <TouchableOpacity className="flex-row items-center gap-2">
                                    <Text className="font-body text-sm text-gray-200">
                                        Ler mais
                                    </Text>
                                    <Icon
                                        name="arrow-right"
                                        size={16}
                                        color="#9e9ea0"
                                    />
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
