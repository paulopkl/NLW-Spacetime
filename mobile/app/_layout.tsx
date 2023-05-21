import React, { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { styled } from "nativewind";
import { BaiJamjuree_700Bold as BaiJamJuree700 } from "@expo-google-fonts/bai-jamjuree";
import {
    useFonts,
    Roboto_400Regular as Roboto400,
    Roboto_700Bold as Roboto700,
} from "@expo-google-fonts/roboto";
import blugImg from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

const StyledStripes = styled(Stripes);

export default function Layout() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<
        boolean | null
    >(null);
    const [hasLoadedFonts] = useFonts({ Roboto400, Roboto700, BaiJamJuree700 });

    useEffect(() => {
        SecureStore.getItemAsync("token").then((token) => {
            setIsUserAuthenticated(!!token);
        });
    }, [isUserAuthenticated]);

    if (!hasLoadedFonts) return <SplashScreen />;
    return (
        <ImageBackground
            source={blugImg}
            className="relative flex-1 bg-gray-900"
            imageStyle={{ position: "absolute", left: "-100%" }}
        >
            <StyledStripes className="absolute left-2" />
            <StatusBar style="light" translucent />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    animation: "fade",
                }}
                initialRouteName="memories/new"
            >
                <Stack.Screen name="index" redirect={isUserAuthenticated} />
                <Stack.Screen name="memories/new" />
                <Stack.Screen name="memories/memories" />
            </Stack>
        </ImageBackground>
    );
}
