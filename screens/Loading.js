import React from 'react'
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'

function Loading() {
    return (
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size='large' color='green'></ActivityIndicator>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Loading;