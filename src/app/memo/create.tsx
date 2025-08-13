import { 
    View, TextInput, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useState} from 'react'

import KeyboardAvoidingView from '../../components/KeyboardAvoidingView'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import { db, auth } from '../../config'

const handlePress = (bodyText: string): void => {
    if (auth.currentUser) {
        const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
        addDoc(ref, {
            bodyText,
            updatedAt: Timestamp.fromDate(new Date()),
        })
            .then((docRef) => {
            console.log('Memo saved', docRef.id)
        })
        .catch((error) => {
            console.error('Error saving memo:', error)
        })
    router.back()
}}

const Create = (): JSX.Element => {
    const [bodyText, setBodyText] = useState('')
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                multiline 
                style={styles.input} 
                value={bodyText} 
                onChangeText={setBodyText}
                autoFocus />
            </View>
            <CircleButton onPress={() => { handlePress(bodyText) }}>
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
        paddingVertical: 32,
        paddingHorizontal: 27,
        flex: 1
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24
    }
})

export default Create