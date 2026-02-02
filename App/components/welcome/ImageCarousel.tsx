////needs optimising in stylesheets

import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useCallback, useState, useEffect } from "react";
import { View, Image, Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("screen");
const ITEM_WIDTH = width; // Assuming your items fill the width

type ImageCarouselProps = {
  data: string[];
};

export default function ImageCarousel({ data }: ImageCarouselProps) {
  const scrollX = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const [loopingData, setLoopingData] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const startClone = data[data.length - 1]; // Last item
      const endClone = data[0]; // First item
      setLoopingData([startClone, ...data, endClone]);
    }
  }, [data]);

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });
  const handleMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / ITEM_WIDTH);

    const isAtEnd = currentIndex === loopingData.length - 1;
    const isAtStart = currentIndex === 0;

    if (isAtEnd) {
      // On the end clone, jump to the first real item (index 1)
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    } else if (isAtStart) {
      // On the start clone, jump to the last real item
      flatListRef.current?.scrollToIndex({
        index: loopingData.length - 2,
        animated: false,
      });
    }
  };

  const { effectiveTheme, colors } = useTheme();
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      {/* Blurred Background */}
      {/*<View style={StyleSheet.absoluteFillObject}>
        {data.map((image, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0, 1, 0],
          });
          return (
            <Animated.Image
              key={`bg-${index}`}
              source={{ uri: image }}
              style={[StyleSheet.absoluteFillObject, { opacity }]}
              blurRadius={40}
            />
          );
        })}
      </View>*/}
      {/* Foreground Carousel */}

      {/* Foreground Carousel - Update these props */}
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          ref={flatListRef} // Add ref
          data={loopingData} // Use loopingData
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          //pagingEnabled // pagingEnabled is required for this logic
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          // --- Add these props for the loop ---
          onMomentumScrollEnd={handleMomentumScrollEnd}
          getItemLayout={getItemLayout}
          initialScrollIndex={1} // Start on the first REAL item
        />
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={[colors.welcomeGradientEnd, "transparent"]} // From dark/black to transparent
        locations={[0, 0.1]} // Gradient covers the top 10%
        style={styles.gradientTop}
      />
      <LinearGradient
        pointerEvents="none"
        colors={["transparent", colors.welcomeGradientEnd]} // From transparent to dark/black
        locations={[0.8, 1]} // Gradient covers the bottom 10%
        style={styles.gradientBottom}
      />
      {/*<LinearGradient
        pointerEvents="none"
          colors={["transparent", "rgba(0,0,0,0.5)"]} // From transparent to dark/black
          locations={[0.9, 1]} // Gradient covers the bottom 10%
          style={styles.gradientBottom}
        />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
    height: "40%",
  },
  imageWrapper: {
    width: width,
    alignItems: "center",
  },
  image: {
    width: width,
    height: height * 0.5,
    resizeMode: "cover",
    borderRadius: 5,
  },
  gradientTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "50%", // Occupies the top half to make the gradient visible
    zIndex: 7, // Ensure it's above the image
  },
  gradientBottom: {
    position: "absolute",
    width: width,
    height: "50%",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
