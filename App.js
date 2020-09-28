import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import { Button, Icon } from "react-native-elements";
import HomeScreen from "./components/HomeScreen";
import TokenInfo from "./components/TokenInfo";

export default function App() {
  const Stack = createStackNavigator();
  // const scheme = useColorScheme();
  const scheme = "dark";

  const searchButton = () => (
    <Button
      icon={<Icon name="search" color={MyTheme.colors.mainFont} />}
      buttonStyle={{ backgroundColor: MyTheme.colors.primary, marginRight: 10 }}
    />
  );
  const backImage = () => (
    <Icon
      name="angle-left"
      type="font-awesome"
      color={MyTheme.colors.mainFont}
    />
  );
  const MyTheme =
    scheme === "dark"
      ? {
          dark: true,
          colors: {
            primary: "#000",
            labelColor: "#8A96AA",
            rateChange: "#33BB5D",
            mainFont: "#F6F6F6",
            selectedTime: "#F15A29",
            borderColor: "#161616",
          },
        }
      : {
          dark: false,
          colors: {
            primary: "#fff",
            labelColor: "#646464",
            rateChange: "#33BB5D",
            mainFont: "#495162",
            selectedTime: "#F15A29",
            borderColor: "#F6F6F6",
          },
        };
  return (
    <AppearanceProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            cardStyle: { backgroundColor: MyTheme.colors.primary },
            headerTitle: "Tracker",
            headerTitleAlign: "center",
            headerRight: searchButton,
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
          }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="TokenInfo"
            component={TokenInfo}
            options={{ headerTitleAlign: "center", headerBackImage: backImage }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
