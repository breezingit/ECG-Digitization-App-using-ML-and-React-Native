import React, { useRef, useState } from "react";
import { Animated, Dimensions, FlatList } from "react-native";

import { CARD_HEIGHT } from "./CardComp";
import HomeComponent from "../HomeComponent";
import { usePeople } from "../../Context/PeopleContext";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useLazyRef = <T extends object>(initializer: () => T) => {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};
const { height } = Dimensions.get("window");
const MARGIN = 16;
const HEIGHT = CARD_HEIGHT + MARGIN * 2;

import WalletCard from "./CardComp";

const Wallet = ({deletePressed, openPressed}) => {
    const people= usePeople()
  const y = useLazyRef(() => new Animated.Value(0));
  const onScroll = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { y },
          },
        },
      ],
      { useNativeDriver: true }
    )
  );
  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      bounces={false}
      {...{ onScroll }}
      data={people}
      renderItem={({ index, item }) => (
        <WalletCard index={index}
            item = {item}
            y={y}
            deletePressed={deletePressed}
            openPressed={openPressed}
            />
      )}
      keyExtractor={item => item["key"]}
    />
  );
};

export default Wallet;