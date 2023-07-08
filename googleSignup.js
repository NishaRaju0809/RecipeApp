import auth from '@react-native-firebase/auth';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export async function onGoogleButtonPress() {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(user => {
        // console.log("user sign in:",user.additionalUserInfo.isNewUser)
        if (user.additionalUserInfo.isNewUser) {
          firestore()
            .collection('Users')
            .add({
              name: user.additionalUserInfo.username,
              email: user.user.email,
            })
            .then(() => {
              Alert.alert(user.additionalUserInfo.username, 'user Added!');
            });
        }
      })
      .catch(error => {
        console.log('error occured...', error);
      });
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log(error);
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(error);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(error);
    } else {
      console.log(error);
    }
  }
}
