import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'

import { Icon } from 'react-native-elements'

class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = { userId: '' };
    }
    componentDidMount = async () => {
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Icon iconStyle={{ marginLeft: 10 }} size={40} name="menu-outline" type="ionicon" color="black" onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()) }} />
                    </View>
                    <View style={{ alignItems: "center", width:'80%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Trang chủ</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <Text>Main Page - {this.state.userId}</Text>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    body: {
        flex: 9,
        justifyContent: 'center'
    },
})


export default MainPage;