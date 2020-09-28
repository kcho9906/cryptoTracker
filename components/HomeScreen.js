import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import { HISTORY_PERIODS } from "../helpers/constants";
import Card from "./Card";

function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [selectedDate, setSelectedDate] = useState("week");
  const [assets, setAssets] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [fetchURI, setFetchURI] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: colors.primary,
    },

    headerText: {
      fontSize: 18,
      lineHeight: 21,
      letterSpacing: 0,
      textAlign: "center",
      color: "#495162",
    },

    timeControls: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    tokenBox: {},
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: <Text style={{}}>Tracker</Text>,
      headerTitleStyle: {
        fontSize: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: colors.mainFont,
        fontFamily: "Arial",
      },
    });
  }, [navigation]);

  useEffect(() => {
    setFetchURI("&period=" + selectedDate);
  }, [selectedDate]);

  // On page load, fetch tokens that have history
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://assets-api.sylo.io/v2/all?has_history_only=true"
      ).then((result) => result.json());
      setAssets(response);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function renderTokenCard() {
      setTokens([]);
      // Fetch token info for card render
      for (let i = 0; i < assets.length; i++) {
        let token = assets[i];
        const tokenHistory = await fetch(
          `https://assets-api.sylo.io/v2/asset/id/${token.id}/rate?type=historic${fetchURI}`
        ).then((result) => result.json());
        tokenHistory.assetIndex = i;
        setTokens((tokens) => [...tokens, tokenHistory]);
      }
    }
    assets !== null && renderTokenCard();
  }, [assets, fetchURI]);

  const timeControlButtons = HISTORY_PERIODS.map((timeControl) => (
    <Button
      title={timeControl}
      type="clear"
      key={HISTORY_PERIODS.indexOf(timeControl)}
      titleStyle={{
        color:
          timeControl === selectedDate
            ? colors.selectedTime
            : colors.labelColor,
        fontSize: 15,
      }}
      onPress={() =>
        setSelectedDate(HISTORY_PERIODS[HISTORY_PERIODS.indexOf(timeControl)])
      }
    />
  ));

  const tokenCards = tokens.map((token) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TokenInfo", {
          token: token,
          asset: assets[token.assetIndex],
          selectedTime: selectedDate,
        })
      }
      key={assets[token.assetIndex].id}
    >
      <Card asset={assets[token.assetIndex]} token={token} rate={token.rate} />
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.timeControls}>{timeControlButtons}</View>
      <SafeAreaView style={styles.tokenBox}>
        <ScrollView scrollEnabled={true}>{tokenCards}</ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;
