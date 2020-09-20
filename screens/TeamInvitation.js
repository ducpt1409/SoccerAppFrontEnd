import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, RefreshControl, Button, Modal, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon, Avatar } from 'react-native-elements'
import { FlatList, } from 'react-native-gesture-handler';

class InvitationSent extends Component {
    constructor(props) {
        super(props);
        this.state = { teamId: '', result: [] }
    }
    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        await this.setState({ teamId: teamId });
        this.getSentInvitation();
    }
    getSentInvitation = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/team-get-sent-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamId: this.state.teamId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ result: json }); })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
    }
    setStatus(value) {
        if (value == '0') return 'Đã từ chối';
        if (value == '1') return 'Đã gửi lời mời';
        if (value == '2') return 'Đã chấp nhận lời mời'
    }
    render() {
        return (
            <View>
                <Text>Lời mời đã gửi : </Text>
                <FlatList data={this.state.result} renderItem={({ item }) =>
                    <View style={{ marginBottom: 20, borderBottomWidth: 0.5 }}>
                        <Text></Text>
                        <Text>Đội mời : {item.teamDTO.name}</Text>
                        <Text>Cầu thủ : {item.user_invite.name}</Text>
                        <Text>Vị trí : {item.position}</Text>
                        <Text>Lúc : {item.date_time}</Text>
                        <Text>Nội dung : {item.note}</Text>
                        <Text>Trạng thái : {this.setStatus(item.status)}</Text>
                    </View>
                } keyExtractor={item => item.id.toString()} />
            </View>
        )
    }
}

class InvitationReceived extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '' }
    }

    render() {
        return (
            <View>
                <Text>abc</Text>
            </View>
        )
    }
}

const Tab = createBottomTabNavigator();

class TeamInvitation extends Component {

    constructor(props) {
        super(props);
        this.state = { teamId: this.props.route.params.teamId }
    }

    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        this.setState({ teamId: teamId });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.body}>
                    <Tab.Navigator tabBarOptions={{ labelStyle: { fontSize: 14, fontWeight: 'bold' }, }}>
                        <Tab.Screen name="InvitationSent" component={InvitationSent} initialParams={{ teamId: this.state.teamId }} />
                        <Tab.Screen name="InvitationReceived" component={InvitationReceived} initialParams={{ teamId: this.state.teamId }} />
                    </Tab.Navigator>
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
        alignItems: "center"
    },
    body: {
        flex: 10,
        justifyContent: 'center'
    },
    modalStyle: {
        width: '60%',
        borderWidth: 1,
        borderRadius: 30,
        marginLeft: '20%',
        backgroundColor: 'white',
        padding: 30,
        marginTop: 100
    }
})


export default TeamInvitation;