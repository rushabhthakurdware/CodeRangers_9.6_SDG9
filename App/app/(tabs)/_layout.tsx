import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/hooks/useAuth";
import { Redirect, Tabs } from "expo-router";
import { Platform, StatusBar, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Entypo } from "@expo/vector-icons";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  if (loading) {
    // 3. Return a themed loading state
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        // tabBarActiveTintColor: colors.tabIconSelected, // Active icon/label color
        // tabBarInactiveTintColor: colors.tabIconDefault, // Inactive icon/label color
        tabBarStyle: {
          backgroundColor: colors.card, // Background of the tab bar
          borderTopColor: colors.border, // Color of the line above the bar
          borderTopWidth: 0,
        },
        tabBarLabel: ({ children, focused }) => {
          return (
            <Text
              style={{
                color: focused
                  ? colors.tabLabelActive
                  : colors.tabLabelInactive,
                fontSize: 10, // Set your label styles here
              }}
            >
              {children}
            </Text>
          );
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={focused ? colors.tabIconActive : colors.tabIconInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create/index"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="circle-with-plus"
              size={24}
              color={focused ? colors.tabIconActive : colors.tabIconInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user-circle"
              size={24}
              color={focused ? colors.tabIconActive : colors.tabIconInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="gear"
              size={24}
              color={focused ? colors.tabIconActive : colors.tabIconInactive}
            />
          ),
        }}
      />
      {/*
        <Tabs.Screen
          name="../posts/[id]" // Assumes you have a file named `app/(tabs)/extra-screen.tsx`
          options={{
            href: null,
          }}
        />*/}
    </Tabs>
  );
}
