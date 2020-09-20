import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, RefreshControl, Button, Modal, TouchableOpacity } from 'react-native'
import { FlatList, } from 'react-native-gesture-handler';

class ChallengeInvitation extends Component {
    constructor(props) {
        super(props);
        this.state = { teamId: '' }
    }

    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        await this.setState({ teamId: teamId });
        this.getReceivedInvitation();
    }
    getReceivedInvitation = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-waiting-match-invitation', {
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

    refuseInvitation = async (invitationId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/update-match-invitation-status', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invitationId: invitationId,
                status: 0,
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') {
                    alert('Đã từ chối');
                } else {
                    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((error) => alert("Có lỗi xảy ra"));
        this.getReceivedInvitation();
    }

    setStatus(value) {
        if (value == '0') return 'Đã từ chối';
        if (value == '1') return 'Đang chờ';
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
                            <TouchableOpacity onPress={() => this.refuseInvitation(item.id)}>
                                <Text style={{ color: "red" }}>Từ chối</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                } keyExtractor={item => item.id.toString()} />
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


export default ChallengeInvitation;