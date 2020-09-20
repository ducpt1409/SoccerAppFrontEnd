import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Input } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

class MakeTeamInvitation extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '', inviteId: '', teamId: '', result: {}, position: '', invitation: '' };
    }

    componentDidMount = async () => {
        const inviteId = this.props.route.params.id;
        const teamId = this.props.route.params.teamId;

        this.setState({ inviteId: inviteId });
        this.setState({ teamId: teamId });

        this.loadPlayerData(inviteId);
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
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

    makeInvitation = async () => {
        const date = new Date();
        let currentTime = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        await fetch('http://192.168.1.116:8080/soccerApp/make-invitation-user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invite_user: this.state.inviteId,
                invite_by: this.state.userId,
                teamId: this.state.teamId,
                position: this.state.position,
                invitation: this.state.invitation,
                date_time: currentTime
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert("Đã gửi lời mời");
                } else {
                    alert("Gửi lời mời không thành công")
                }
            });
    }

    render() {
        return (
            <View style={styles.body}>
                <View style={styles.avatarPart}>
                    <Avatar size="xlarge" rounded source={{ uri: this.state.result.avatarUrl }} />
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
                <Text>Nhập nội dung : </Text>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                    <View style={styles.leftSide}>
                        <Text style={{ marginTop: 40, fontSize: 18 }}>Lời mời : </Text>
                        <Text style={styles.title}>Vị trí: </Text>
                    </View>
                    <View style={styles.rightSide}>
                        <Input style={styles.inpField} value={this.state.invitation} placeholder='Invitation' onChangeText={(text) => this.setState({ invitation: text })}></Input>
                        <Input style={styles.inpField} value={this.state.position} placeholder='Position' onChangeText={(text) => this.setState({ position: text })}></Input>
                    </View>
                </View>
                <TouchableOpacity style={styles.btnSubmit} onPress={this.makeInvitation}>
                    <Text style={{ fontSize: 16, color: 'white' }}>Gửi lời mời</Text>
                </TouchableOpacity>
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
    },
    leftSide: {
        flex: 2,
        alignItems: 'flex-end',
    },
    rightSide: {
        flex: 3,
    },
    title: {
        fontSize: 18,
        marginTop: 70,
        marginRight: 10
    },
    inpField: {
        marginTop: 20,
    },
    btnSubmit: {
        backgroundColor: '#FF8000',
        borderWidth: 0,
        height: 40,
        width: 200,
        marginLeft: '30%',
        marginBottom: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: 'center'

    }
})


export default MakeTeamInvitation;