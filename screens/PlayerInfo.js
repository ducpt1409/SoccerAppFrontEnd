import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, RefreshControl, Button } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { Icon, Avatar } from 'react-native-elements'


class PlayerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '', result: {} };
    }

    componentDidMount = async () => {
        const userId = this.props.route.params.id;
        this.loadPlayerData(userId);
    }

    loadPlayerData = async (userId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/getUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ result: json }) });
    }

    render() {
        return (
            <View style={styles.body}>
                <View style={styles.avatarPart}>
                    <Avatar size="xlarge" rounded source={{ uri: 'https://scontent-hkg4-1.xx.fbcdn.net/v/t1.0-9/89774889_1345595625627508_132693633085210624_o.jpg?_nc_cat=106&_nc_sid=09cbfe&_nc_ohc=-_ICVjCsQtoAX_5w0CY&_nc_ht=scontent-hkg4-1.xx&oh=0a4272fe3edbc538aaf69479b0da10e3&oe=5F74BAF5' }} />
                </View>
                <View style={styles.inforPart}>
                    <Text>Tên : {this.state.result.name}</Text>
                    <Text>Ngày sinh : {this.state.result.doB}</Text>
                    <Text>Địa chỉ  : {this.state.result.location}</Text>
                    <Text>Số điện thoại : {this.state.result.phone}</Text>
                    <Text>E-mail : {this.state.result.email}</Text>
                    <Text>Ngày sinh : {this.state.result.doB}</Text>
                    <Text>Giới thiệu : {this.state.result.introduce}</Text>
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
    body: {
        flex: 1,
        justifyContent: 'center'
    },
    avatarPart: {
        flex: 1,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inforPart: {
        flex: 2,
        borderWidth: 1,
    }

})


export default PlayerInfo;