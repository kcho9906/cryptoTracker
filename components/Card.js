import { useTheme } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-svg-charts";

const Card = (props) => {
  const { colors, dark } = useTheme();

  const data = props.token.history.map((element) => element.rate);
  const lastRate = data[data.length - 1];
  const firstRate = data[0];
  const value = parseFloat(lastRate - firstRate).toFixed(4);
  const percentage = ((100 * (lastRate - firstRate)) / firstRate).toFixed(2);

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: colors.borderColor,
      borderRadius: 15,
      marginTop: 9,
      marginBottom: 9,
    },

    infoBar: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    tokenIdentifier: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },

    monetaryValues: {
      display: "flex",
      flexDirection: "column",
      textAlign: "right",
      alignItems: "flex-end",
      paddingRight: 12,
    },
  });

  return (
    <View class="container" style={styles.container}>
      <View style={styles.infoBar}>
        <View style={styles.tokenIdentifier}>
          <Image
            source={{
              uri: dark
                ? props.asset.icon_address_dark
                : props.asset.icon_address,
            }}
            style={{ height: 36, width: 36, margin: 10 }}
          ></Image>
          <Text style={{ fontSize: 15, color: colors.mainFont }}>
            {props.asset.name}
          </Text>
        </View>
        <View style={styles.monetaryValues}>
          <Text style={{ fontSize: 15, color: colors.mainFont }}>
            ${parseFloat(props.rate).toFixed(4)}
          </Text>
          <Text style={{ size: 12, color: "#33BB5D" }}>
            {value > 0 ? "+" : ""}
            {percentage}% (${Math.abs(value)})
          </Text>
        </View>
      </View>
      <View class="graph">
        <LineChart
          style={{ height: 66 }}
          data={data}
          svg={{
            stroke: colors.selectedTime,
            strokeWidth: 3,
            strokeOpacity: 0.6,
          }}
        ></LineChart>
      </View>
    </View>
  );
};

export default Card;
