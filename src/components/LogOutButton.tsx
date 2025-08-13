import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native"
import { signOut } from "firebase/auth"
import { router } from "expo-router"

import { auth } from "../config"

const handlePress = (): void => {
    signOut(auth)
        .then(() => {
            console.log('User logged out')
            router.replace('/auth/log_in')
        })
        .catch((error) => {
            console.error('Log out error:', error)
            Alert.alert('Log out error', error.message)
        })
}


const LogOutButton = (): JSX.Element => {
    return (
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.text}>ログアウト</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        lineHeight: 24,
        color: 'rgba(255, 255, 255, 0.7)'
    }
})

export default LogOutButton
