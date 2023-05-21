import { useEffect } from "react";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import Stripes from "../src/assets/stripes.svg";
import NlwSpaceTime from "../src/assets/nlw-spacetime-logo.svg";
import { api } from "../src/lib/api";

const StyledStripes = styled(Stripes);

const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint:
        "https://github.com/settings/connections/applications/2b82babafc011e49da00",
};

export default function App() {
    const router = useRouter();
    const [request, response, signInWithGithub] = useAuthRequest(
        {
            clientId: "2b82babafc011e49da00",
            scopes: ["identity"],
            redirectUri: makeRedirectUri({
                scheme: "nlw_spacetime",
            }),
        },
        discovery
    );

    const handleGithubOauth = async (code: string) => {
        const apiResponse = await api.post("/register", { code });
        const { token } = apiResponse.data;

        await SecureStore.setItemAsync("token", token);

        router.push("/memories");
    };

    // useEffect(() => {
    //     if (response?.type === "success") {
    //         const { code } = response.params;

    //         handleGithubOauth(code);
    //     }
    // }, [response]);

    return (
        <View className="flex-1 items-center px-8 py-10">
            <View className="flex-1 items-center justify-center gap-6">
                <NlwSpaceTime />
                <View className="space-y-2">
                    <Text className="text-center font-title text-2xl leading-tight text-gray-50">
                        Sua cápsula do tempo
                    </Text>
                    <Text className="text-center font-body text-base leading-relaxed text-gray-100">
                        Colecione momentos marcantes da sua jornada e
                        compartilhe (se quiser) com o mundo!
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="rounded-full bg-green-500 px-5 py-3"
                    // onPress={() => signInWithGithub()}
                    onPress={() => router.push("memories/new")}
                >
                    <Text className="font-alt text-sm uppercase text-black">
                        Cadastrar lembrança
                    </Text>
                </TouchableOpacity>
            </View>
            <Text className="font-title text-5xl text-gray-50">
                Sua cápsula do tempo
            </Text>
            <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
                Feito com amor no NLW por Paulo
            </Text>
        </View>
    );
}

// dp - pixel density
