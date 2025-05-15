import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    Mulish: require('../assets/fonts/Mulish-Regular.ttf'),
  });

  if (!loaded) {    
    return null;
  }

  const screenOptions = {
    headerStyle: {
      backgroundColor: Colors.background,
    },
    headerTintColor: Colors.tint,
    headerTitleAlign: "center" as "center",
    headerTitleStyle: {
      fontSize: 18,
    },
  };

  return (
    <SafeAreaProvider style={{ paddingTop: 30}}>     
        <Stack screenOptions={screenOptions} initialRouteName="index">
          <Stack.Screen name="index" options={{ headerTitleAlign: "center", headerTitle: 'Crear pago', headerTitleStyle: {fontWeight: 'bold', fontSize: 18} }} />
          <Stack.Screen name="PaymentShareScreen" options={{ headerShown: false }} />
          <Stack.Screen name="CurrencySelectionScreen" options={{ headerTitleAlign: "center", headerTitle: 'Selecciona una divisa', headerTitleStyle: {fontWeight: 'bold', fontSize: 18} }} />
          <Stack.Screen name="SuccessScreen" />
          <Stack.Screen name="QRScreen" options={{ headerTitle: '' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style='auto' />      
    </SafeAreaProvider>
  );
}
