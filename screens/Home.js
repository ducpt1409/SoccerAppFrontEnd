import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Button } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'

import MainPage from './MainPage'
import PersonalPage from './PersonalPage'
import ChangePassword from './ChangePassword'
import Teams from './Teams'
import PersonalInvitation from './PersonalInvitations'


function CustomerDrawer(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label='Close' onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer)} />
            <DrawerItem label='Đăng xuất' onPress={async () => {
                props.navigation.navigate('SignIn'); AsyncStorage.getAllKeys()
                    .then(keys => AsyncStorage.multiRemove(keys));
            }}
            />
        </DrawerContentScrollView>
    )
}

const Drawer = createDrawerNavigator();
class MyDrawer extends Component {
    render() {
        return (
            <Drawer.Navigator drawerContent={props => <CustomerDrawer {...props} />}>
                <Drawer.Screen name="Trang chủ" component={MainPage} options={{
                    drawerIcon: config => <Icon name="home-outline" type="ionicon" color="black" />
                }} />
                <Drawer.Screen name="Trang cá nhân" component={PersonalPage} options={{
                    drawerIcon: config => <Icon name="person-outline" type="ionicon" color="black" />
                }} />
                <Drawer.Screen name="Đổi mật khẩu" component={ChangePassword} options={{
                    drawerIcon: config => <Icon name="key-outline" type="ionicon" color="black" />
                }} />
                <Drawer.Screen name="Đội bóng của bạn" component={Teams} options={{
                    drawerIcon: config => <Icon name="people-outline" type="ionicon" color="black" />
                }} />
                <Drawer.Screen name="Lời mời tham gia" component={PersonalInvitation} options={{
                    drawerIcon: config => <Icon name="paper-plane-outline" type="ionicon" color="black" />
                }} />
            </Drawer.Navigator>
        )
    }

}

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = { userId: '' }
    }

    render() {
        return (
            <MyDrawer></MyDrawer>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

})