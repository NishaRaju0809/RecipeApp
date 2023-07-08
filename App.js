import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useState, useEffect} from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import LoginScreen from './screens/LoginScreen/loginScreen';
import SplashScreen from './screens/SplashScreen/splashScreen';
import SignUpScreen from './screens/SignUp/SignupScreen';
import SaveScreen from './screens/SaveScreen/SaveScreen';
import NotificationScreen from './screens/NotificationScreen/Notifications';
import Profile from './screens/Profile/Profile';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import HomeActiveIcon from './icons/homeActive';
import HomeUnActiveIcon from './icons/home';
import SaveActiveIcon from './icons/saveActive';
import SaveUnActiveIcon from './icons/saveIcon';
import NotificationActiveIcon from './icons/notificationActive';
import NotificationUnActiveIcon from './icons/notificationIcon';
import ProfileActiveIcon from './icons/profileActive';
import ProfileUnActiveIcon from './icons/profileIcon';
import SearchScreen from './screens/SearchRecipee/SearchRecipeeScreen';
import DetailScreen from './screens/DetailsScreen/DetailsScreen';
import ReviewScreen from './screens/Reviews/ReviewScreen';
import AddRecipes from './screens/AddRecipes.js/AddRecipesScreen';
import AddRecipesButton from './components/AddRecipesButton';
import EditProfileScreen from './screens/EditProfile/EditProfileScreen';
import BottomNavigator from './components/BottomNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function AuthanticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="Reviews" component={ReviewScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomNavigator {...props} />}
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? <HomeActiveIcon /> : <HomeUnActiveIcon />,
        }}
      />
      <Tab.Screen
        name="Save"
        component={SaveScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? <SaveActiveIcon /> : <SaveUnActiveIcon />,
        }}
      />
      <Tab.Screen
        name="AddRecipes"
        component={AddRecipes}
        options={{
          tabBarIcon: () => <AddRecipesButton />,
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? <NotificationActiveIcon /> : <NotificationUnActiveIcon />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? <ProfileActiveIcon /> : <ProfileUnActiveIcon />,
        }}
      />
    </Tab.Navigator>
  );
}
export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userExists, setUserExists] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '95899567945-8hn11oreh94vbola5kv4ksd4lkm1sv5i.apps.googleusercontent.com',
    });
  }, []);

  function onAuthStateChanged(user) {
    setUserExists(user);
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  const HandleDeepLinking = () => {
    const navigation = useNavigation();
    const handleDynamicLinks = async link => {
      // console.log('Foreground link handling:', link)
      let id = link.url.split('=').pop();

      navigation.navigate('DetailScreen', {id: id});
    };
    useEffect(() => {
      const unsubscribe = dynamicLinks().onLink(handleDynamicLinks);
      return () => unsubscribe();
    }, []);

    return null;
  };

  return (
    <>
      <NavigationContainer>
        <HandleDeepLinking />
        {!userExists ? <AuthStack /> : <AuthanticatedStack />}
      </NavigationContainer>
    </>
  );
}
