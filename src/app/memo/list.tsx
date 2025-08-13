import { View, Text, StyleSheet, FlatList } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

import MemoListItem from '../../components/MemoListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'
import { db, auth } from '../../config'
import { type Memo } from '../../../types/memo'

const handlePress = (): void => {
    // メモ作成画面に遷移
    router.push('/memo/create')
}

const List = (): JSX.Element => {
    const [memos, setMemos] = useState<Memo[]>([])
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => ( <LogOutButton /> )
        })
    }, [])
    useEffect(() => {
        if (auth.currentUser) {
            const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
            const q = query(ref, orderBy('updatedAt', 'desc'))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const remoteMemos: Memo[] = []
                snapshot.forEach(doc => {
                    // Do something with each memo document
                    const { bodyText, updatedAt } = doc.data()
                    remoteMemos.push({ 
                        id: doc.id, 
                        bodyText, 
                        updatedAt 
                    })
                })
                setMemos(remoteMemos)
            })
            return unsubscribe
        }
    }, [])

    return (
        <View style={styles.container}>
            <FlatList 
                data={memos}
                renderItem={({ item }) => <MemoListItem memo={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 32 }}
            />
            <CircleButton onPress={handlePress}>
                <Icon name='plus' size={40} color='#ffffff' />
            </CircleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ffffff'
    }
})

export default List