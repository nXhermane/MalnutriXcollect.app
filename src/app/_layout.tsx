import { SplashScreen, Stack } from "expo-router";
import "@/../global.css";
import { UIProvider, useUI } from "@/providers";

export default function RootLayout() {
  return (
    <UIProvider>
      <Main />
    </UIProvider>
  );
}

function Main() {
  const { error, loaded } = useUI();

  if (loaded) {
    SplashScreen.hideAsync();
  }
  if (error) {
    console.error(error);
    return null;
  }
  return <Stack />;
}
