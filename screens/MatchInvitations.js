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
        this.state = { matchId: '', result: [] }
    }
    componentDidMount = async () => {
        const matchId = this.props.route.params.matchId;
        await this.setState({ matchId: matchId });
        this.getSentInvitation();
    }
    getSentInvitation = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-sent-match-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: this.state.matchId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ result: json }); })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
    }

    deleteInvitation = async (invitationId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/delete-match-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: invitationId
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert('Đã xoá lời mời');
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((error) => alert("Có lỗi xảy ra"));
        this.getSentInvitation();
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
                    <View style={{ marginTop: 20, marginBottom: 20, borderBottomWidth: 0.5 }}>
                        <Text>Tên trận : {item.matchDTO.match_name}</Text>
                        <Text>Đội mời : {item.teamInvite.name}</Text>
                        <Text>Đội tạo : {item.matchDTO.teamCreate.name}</Text>
                        <Text>Vị trí : {item.matchDTO.location}</Text>
                        <Text>Diễn ra : {item.matchDTO.time}</Text>
                        <Text>Thông báo nhận lúc : {item.time}</Text>
                        <Text>Nội dung : {item.note}</Text>
                        <Text>Trạng thái : {this.setStatus(item.status)}</Text>
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.deleteInvitation(item.id)}>
                                <Text style={{ color: "red" }}>Xoá lời mời</Text>
                            </TouchableOpacity>
                        </View>
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

    componentDidMount = async () => {
        const matchId = this.props.route.params.matchId;
        await this.setState({ matchId: matchId });
        this.getReceivedInvitation();
    }
    getReceivedInvitation = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-received-match-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: this.state.matchId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ result: json }); })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
    }

    approveInvitation = async (invitationId, matchId, teamInvite) => {
        await fetch('http://192.168.1.116:8080/soccerApp/approve-match-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: invitationId,
                matchId: matchId,
                teamInvite: teamInvite
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert('Chấp nhận thành công. Trận đấu đã được thêm vào lịch');
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
        this.getReceivedInvitation();
    }

    deleteInvitation = async (invitationId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/delete-match-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: invitationId
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert('Đã xoá lời mời');
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
        this.getReceivedInvitation();
    }

    setStatus(value) {
        if (value == '0') return 'Đã từ chối';
        if (value == '1') return 'Đã gửi lời mời';
        if (value == '2') return 'Đã chấp nhận lời mời'
    }

    render() {
        return (
            <View>
                <Text>Lời mời đã nhận : </Text>
                <FlatList data={this.state.result} renderItem={({ item }) =>
                    <View style={{ marginTop: 20, marginBottom: 20, borderBottomWidth: 0.5 }}>
                        <Text>Tên trận : {item.matchDTO.match_name}</Text>
                        <Text>Đội mời : {item.teamInvite.name}</Text>
                        <Text>Đội tạo : {item.matchDTO.teamCreate.name}</Text>
                        <Text>Vị trí : {item.matchDTO.location}</Text>
                        <Text>Diễn ra : {item.matchDTO.time}</Text>
                        <Text>Thông báo nhận lúc : {item.time}</Text>
                        <Text>Nội dung : {item.note}</Text>
                        <Text>Trạng thái : {this.setStatus(item.status)}</Text>

                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity onPress={() => { this.approveInvitation(item.id, item.matchDTO.id, item.teamInvite.id) }}>
                                <Text style={{ color: "blue" }}>Chấp nhận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={{ color: "red" }}>Xoá lời mời</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                } keyExtractor={item => item.id.toString()} />
            </View>
        )
    }
}

const Tab = createBottomTabNavigator();

class MatchInvitations extends Component {

    constructor(props) {
        super(props);
        this.state = { matchId: this.props.route.params.matchId }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.body}>
                    <Tab.Navigator tabBarOptions={{ labelStyle: { fontSize: 14, fontWeight: 'bold' }, }}>
                        <Tab.Screen name="InvitationSent" component={InvitationSent} initialParams={{ matchId: this.state.matchId }} />
                        <Tab.Screen name="InvitationReceived" component={InvitationReceived} initialParams={{ matchId: this.state.matchId }} />
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


export default MatchInvitations;