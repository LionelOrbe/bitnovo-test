import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Mulish: require('../assets/fonts/Mulish-Regular.ttf'),
  });

  if (!loaded) {    
    return null;
  }

  const screenOptions = {
    headerStyle: {
      backgroundColor: Colors.light.background,
    },
    headerTintColor: Colors.light.primary,
    headerTitleAlign: "center" as "center",
    headerTitleStyle: {
      fontSize: 18,
    },
  };

  return (
    <SafeAreaProvider style={{ paddingTop: 30}}>
      <ThemeProvider
        value={{
          ...colorScheme === 'dark' ? DarkTheme : DefaultTheme,
          colors: {
            ...colorScheme === 'dark' ? Colors.dark : Colors.light,
          },
        }}
      >
        <Stack screenOptions={screenOptions} initialRouteName="index">
          <Stack.Screen name="index" options={{ headerTitleAlign: "center", headerTitle: 'Crear pago', headerTitleStyle: {fontWeight: 'bold', fontSize: 18} }} />
          <Stack.Screen name="PaymentShareScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CurrencySelectionScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SuccessScreen" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style='auto' />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
