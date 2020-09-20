import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, RefreshControl, Button, Modal, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon, Avatar } from 'react-native-elements'
import { FlatList, } from 'react-native-gesture-handler';

class InvitationByTeam extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '', result: [], modalIsOpen: false, selectedItem: {}, selectedInviteBy: {}, selectedInviteTeam: {} }
    }
    componentDidMount = async () => {
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
        this.getReceivedInvitation();
    }
    getReceivedInvitation = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/user-get-waiting-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.userId
            }),
        }).then((response) => response.json())
            .then((json) => {this.setState({ result: json }); })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
    }
    approveInvitation = async (invitationId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/approve-team-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: invitationId,
                teamId: this.state.selectedInviteTeam.id,
                userId: this.state.userId,
                position: this.state.selectedItem.position
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert('Xác nhận thành công. Bạn có thể vào danh mục đội để kiểm tra');
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
        this.getReceivedInvitation();
    }

    declineInvitation = async (invitationId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/refuse-team-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: invitationId,
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert('Đã từ chối yêu cầu.');
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
        this.getReceivedInvitation();
    }

    render() {
        return (
            <View>
                <Text>Lời mời đã nhận : </Text>
                <FlatList data={this.state.result} renderItem={({ item }) =>
                    <View style={{ marginBottom: 20, borderBottomWidth: 0.5 }}>
                        <Text>Đội mời : {item.teamDTO.name}</Text>
                        <Text>Vị trí : {item.position}</Text>
                        <Text>Lúc : {item.date_time}</Text>
                        <Text>Nội dung : {item.note}</Text>
                        <TouchableOpacity onPress={
                            () => {
                                this.setState({ selectedItem: item });
                                this.setState({ modalIsOpen: true });
                                this.setState({ selectedInviteBy: item.invite_by })
                                this.setState({ selectedInviteTeam: item.teamDTO })
                            }
                        }>
                            <Text>Chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                } keyExtractor={item => item.id.toString()} />

                <Modal animationType="fade" onRequestClose={() => { this.setState({ modalIsOpen: false }) }}
                    visible={this.state.modalIsOpen} transparent>
                    <View style={styles.modalStyle}>
                        <Text>Đội mời : {this.state.selectedInviteTeam.name} </Text>
                        <Text>Vị trí : {this.state.selectedItem.position}</Text>
                        <Text>Lúc : {this.state.selectedItem.date_time} </Text>
                        <Text>Nội dung : {this.state.selectedItem.note}</Text>
                        <Text>Được mời bởi : {this.state.selectedInviteBy.name}</Text>

                        <TouchableOpacity onPress={() => this.approveInvitation(this.state.selectedItem.id)}>
                            <Text style={{ fontSize: 16, color: 'green', marginTop: 12 }}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.declineInvitation(this.state.selectedItem.id)}>
                            <Text style={{ fontSize: 16, color: 'red', marginTop: 12 }}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: false })}>
                            <Text style={{ fontSize: 16, color: 'blue', marginTop: 12 }}>Close</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>
            </View>
        )
    }
}

class InvitationBySelf extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '' }
    }
    componentDidMount = async () => {
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
    }
    render() {
        return (
            <View>
                <Text>Lời mời đã gửi : </Text>
                <Text>{this.state.userId}</Text>
            </View>
        )
    }
}

const Tab = createBottomTabNavigator();

class PersonnalInvitations extends Component {

    constructor(props) {
        super(props);
        this.state = { userId: '7' }
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
                    <View style={{ alignItems: "center", width: '80%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Lời mời tham gia</Text>
                    </View>

                </View>
                <View style={styles.body}>
                    <Tab.Navigator tabBarOptions={{ labelStyle: { fontSize: 14, fontWeight: 'bold' }, }}>
                        <Tab.Screen name="InvitationReceived" component={InvitationByTeam} initialParams={{ userId: '7' }} />
                        <Tab.Screen name="InvitationSent" component={InvitationBySelf} initialParams={{ userId: this.state.userId }} />
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


export default PersonnalInvitations;