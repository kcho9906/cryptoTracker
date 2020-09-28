import { useTheme } from "@react-navigation/native";
import * as shape from "d3-shape";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { LineChart } from "react-native-svg-charts";
import { HISTORY_PERIODS } from "../helpers/constants";

function TokenInfo({ route, navigation }) {
  const { colors, dark } = useTheme();

  const { token } = route.params;
  const { asset } = route.params;
  const { selectedTime } = route.params;

  const [selectedDate, setSelectedDate] = useState(selectedTime);
  const [fetchURI, setFetchURI] = useState("&period=" + selectedTime);

  const [data, setData] = useState(
    token.history.map((history) => history.rate)
  );
  const [value, setValue] = useState();
  const [percentage, setPercentage] = useState();
  const [tokenHistory, setTokenHistory] = useState(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: colors.primary,
      justifyContent: "flex-start",
      paddingRight: 10,
      paddingLeft: 10,
      fontSize: 15,
      color: colors.mainFont,
    },

    graphBox: {
      display: "flex",
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: colors.borderColor,
      borderRadius: 15,
      height: 185,
    },

    tokenIdentifier: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },

    tokenName: {
      fontSize: 18,
      color: colors.mainFont,
    },

    monetaryValues: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    information: {
      justifyContent: "space-between",
      lineHeight: 21,
      margin: 20,
    },

    tokenInfoFont: {
      fontSize: 15,
      color: colors.labelColor,
      flex: 2,
    },

    tokenInfoFontLabel: {
      fontSize: 15,
      color: colors.labelColor,
      flex: 1,
    },

    tokenInfoRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 6,
    },

    informationBody: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
    },

    timeControls: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerTitleStyle: {
        fontSize: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: colors.mainFont,
      },
    });
  }, [navigation]);

  const title = () => (
    <View style={styles.tokenIdentifier}>
      <Image
        source={{ uri: dark ? asset.icon_address_dark : asset.icon_address }}
        style={{ height: 36, width: 36, marginRight: 5 }}
      ></Image>
      <Text style={styles.tokenName}>{asset.name}</Text>
    </View>
  );

  const Gradient = ({ index }) => (
    <Defs key={index}>
      <LinearGradient id={"gradient"} x1={"0%"} y={"0%"} x2={"0%"} y2={"100%"}>
        <Stop offset={"0%"} stopColor={colors.primary} stopOpacity={1} />
        <Stop offset={"100%"} stopColor={colors.selectedTime} stopOpacity={1} />
      </LinearGradient>
    </Defs>
  );

  useEffect(() => {
    let firstRate = data[0];
    let lastRate = data[data.length - 1];
    setValue(parseFloat(lastRate - firstRate).toFixed(4));
    setPercentage(((100 * (lastRate - firstRate)) / firstRate).toFixed(2));
  }, [data]);

  useEffect(() => {
    setFetchURI("&period=" + selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (tokenHistory !== null) {
      setData(tokenHistory.history.map((element) => element.rate));
    }
  }, [tokenHistory]);

  useEffect(() => {
    async function renderTokenCard() {
      const tokenHistory = await fetch(
        `https://assets-api.sylo.io/v2/asset/id/${asset.id}/rate?type=historic${fetchURI}`
      ).then((result) => result.json());
      setTokenHistory(tokenHistory);
    }
    renderTokenCard();
  }, [fetchURI]);

  function updateSelectedTime(timePeriod) {
    setSelectedDate(timePeriod);
  }

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
        updateSelectedTime(
          HISTORY_PERIODS[HISTORY_PERIODS.indexOf(timeControl)]
        )
      }
    />
  ));

  return (
    <View style={styles.container}>
      <View style={styles.timeControls}>{timeControlButtons}</View>
      <View style={styles.graphBox}>
        <View style={styles.monetaryValues}>
          <Text style={{ fontSize: 18, color: colors.mainFont }}>
            ${parseFloat(token.rate).toFixed(4)}
          </Text>
          <Text style={{ fontSize: 12, color: colors.rateChange }}>
            {value > 0 ? "+" : ""}
            {percentage}% (${Math.abs(value)})
          </Text>
        </View>
        <LineChart
          style={{ height: 66 }}
          data={data}
          curve={shape.curveBasis}
          svg={{
            stroke: colors.selectedTime,
            strokeWidth: 3,
            strokeOpacity: 0.6,
            fill: "url(#gradient)",
          }}
        ></LineChart>
      </View>
      <View style={styles.information}>
        <Text
          style={{ fontSize: 15, color: colors.mainFont, textAlign: "center" }}
        >
          Information
        </Text>
        <View style={{}}>
          <View style={styles.tokenInfoLabel}>
            <View style={styles.tokenInfoRow}>
              <Text style={styles.tokenInfoFontLabel}>Symbol:</Text>
              <Text style={styles.tokenInfoFont}>
                {asset.name.toUpperCase()}
              </Text>
            </View>
            <View style={styles.tokenInfoRow}>
              <Text style={styles.tokenInfoFontLabel}>Market Cap:</Text>
              <Text style={styles.tokenInfoFont}>
                {token.market_cap} {token.fiat_symbol}
              </Text>
            </View>
            <View style={styles.tokenInfoRow}>
              <Text style={styles.tokenInfoFontLabel}>24h Volume:</Text>
              <Text style={styles.tokenInfoFont}>
                {token.volume_24h} {token.fiat_symbol}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default TokenInfo;
