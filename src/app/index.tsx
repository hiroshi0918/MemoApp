import { Redirect, router } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

import { auth } from '../config'
    
const Index = (): JSX.Element => {
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace('/memo/list')
            } else {
                router.replace('/auth/sign_up')
            }
        })
    }, [])
}

export default Index