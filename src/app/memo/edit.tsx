import { 
    View, TextInput, StyleSheet,
    Alert
} from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { auth, db } from '../../config'


const handlePress = (id: string, bodyText: string): void => {
    // メモを保存する処理
    if (auth.currentUser == null) return
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    setDoc(ref, {
        bodyText,
        updatedAt: Timestamp.now()
    })
        .then(() => {
            router.back()
        })
        .catch((error) => {
            console.error("Error saving memo:", error)
            Alert.alert("Error", "メモの保存中にエラーが発生しました。")
        })
}

const Edit = (): JSX.Element => {
    const id = String(useLocalSearchParams().id)
    const [bodyText, setBodyText] = useState('')
    useEffect(() => {
        if (auth.currentUser === null) { return }
        const ref = doc(db, `users/${auth.currentUser?.uid}/memos`, id)
        getDoc(ref)
            .then((DocRef) => {
                const RemoteBodyText = DocRef.data()?.bodyText || ''
                setBodyText(RemoteBodyText)
            })
            .catch((error) => {
                console.error("Error fetching document:", error)
            })
    }, [])
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                multiline 
                style={styles.input} 
                value={bodyText} 
                onChangeText={setBodyText} 
                autoFocus
                />
            </View>
            <CircleButton onPress={() => { handlePress(id, bodyText) }}>
                <Icon name='check' size={40} color='#ffffff' />
            </CircleButton>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        flex: 1
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24,
        paddingVertical: 32,
        paddingHorizontal: 27
    }
})

export default Edit