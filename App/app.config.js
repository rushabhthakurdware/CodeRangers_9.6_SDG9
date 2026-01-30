// 1. Import the dotenv config at the very top
import 'dotenv/config';

export default {
  "expo": {
    "name": "CivicSync",
    "slug": "CivicSync",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "civicapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "usesCleartextTraffic": true,
      "abiFilters": [
        "arm64-v8a"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "androidStatusBar": {
        "translucent": true
      },
      "package": "com.anonymous.CivicSync",
      "config": {
    "googleMaps": {
      "apiKey": process.env.GOOGLE_MAPS_API_KEY
    }
  }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "react-native-edge-to-edge"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
