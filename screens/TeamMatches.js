import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { Icon, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';


class TeamMatches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamId: '', result: [], modalIsOpen: false, selectedItem: {}
        };
    }

    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        await this.setState({ teamId: teamId });
        this.loadCreatedMatches(teamId);
    }

    loadCreatedMatches = async (teamId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-created-match', {
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
    changeMatchStatus = async (matchId, status) => {
        await fetch('http://192.168.1.116:8080/soccerApp/change-match-status', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: matchId,
                status: status
            }),
        }).then((response) => response.json())
            .then((json) => { if (json.msg == "success") { alert('Thay đổi thành công') } else { alert('Có lỗi xảy ra') } })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
        this.loadCreatedMatches();
    }
    deleteMatch = async (matchId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/delete-match', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: matchId
            }),
        }).then((response) => response.json())
            .then((json) => { if (json.msg == "success") { alert('Thay đổi thành công') } else { alert('Có lỗi xảy ra') } })
            .catch((error) => alert("Có lỗi xảy ra, vui lòng thử lại sau."));
        this.loadCreatedMatches();
    }
    setStatus(value) {
        if (value == '0') return 'Đã huỷ';
        if (value == '1') return 'Đang đợi';
        if (value == '2') return 'Sắp diễn ra';
        if (value == '3') return 'Đã kết thúc';
    }
    setInviteTeam(value) {
        if (value == null) return "Chưa có đội";
        else return value.name;
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Các trận đấu đã tạo : </Text>
                <FlatList data={this.state.result} renderItem={({ item }) =>
                    <View style={{ marginBottom: 20, marginTop: 20, borderBottomWidth: 0.5 }}>
                        <Text>{item.teamCreate.name}</Text>
                        <Text>Tên trận : {item.match_name}</Text>
                        <Text>Vị trí : {item.location}</Text>
                        <Text>Diễn ra lúc : {item.time}</Text>
                        <Text>Nội dung : {item.note}</Text>
                        <Text>Đấu với : {this.setInviteTeam(item.teamJoin)}</Text>
                        <Text>Trạng thái : {this.setStatus(item.status)}</Text>
                        <TouchableOpacity onPress={() => { this.setState({ selectedItem: item }); this.setState({ modalIsOpen: true }); }}>
                            <Text style={{ color: 'blue' }}>Chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                } keyExtractor={item => item.id.toString()} />
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('MatchMaking', { teamId: this.state.teamId }) }}>
                    <Text style={{ color: 'blue' }}>Tạo trận đấu</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this.setState({ modalIsOpen: false }); this.loadCreatedMatches(); }}>
                    <Text style={{ color: 'blue' }}>Reload</Text>
                </TouchableOpacity>

                <Modal animationType="fade" onRequestClose={() => { this.setState({ modalIsOpen: false }) }}
                    visible={this.state.modalIsOpen} transparent>
                    <View style={styles.modalStyle}>
                        <Text>Trận đấu</Text>
                        <Text>Tên trận : {this.state.selectedItem.match_name}</Text>
                        <Text>Vị trí : {this.state.selectedItem.location}</Text>
                        <Text>Diễn ra lúc : {this.state.selectedItem.time}</Text>
                        <Text>Nội dung : {this.state.selectedItem.note}</Text>
                        <Text>Đấu với : {this.setInviteTeam(this.state.selectedItem.teamJoin)}</Text>
                        <Text>Trạng thái : {this.setStatus(this.state.selectedItem.status)}</Text>

                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity onPress={() => { this.setState({ modalIsOpen: false }); this.props.navigation.navigate("InviteTeamToMatch", { matchId: this.state.selectedItem.id }) }}>
                                <Text style={{ color: 'blue' }}>Mời đội</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ modalIsOpen: false }); this.props.navigation.navigate("MatchInvitations", { matchId: this.state.selectedItem.id }) }}>
                                <Text style={{ color: 'green' }}>Tất cả lời mời</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ modalIsOpen: false }); this.props.navigation.navigate("MatchResult", { matchId: this.state.selectedItem.id }) }}>
                                <Text style={{ color: 'green' }}>Cập nhật kết quả</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.changeMatchStatus(this.state.selectedItem.id, 0)}>
                                <Text style={{ color: 'purple' }}>Huỷ trận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.deleteMatch(this.state.selectedItem.id)}>
                                <Text style={{ color: 'red' }}>Xoá trận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(item) => { this.setState({ modalIsOpen: false }) }}>
                                <Text style={{ color: 'orange' }}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        flex: 10,
        justifyContent: 'center'
    },
    avatarPart: {
        flex: 1,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inforPart: {
        flex: 3,
        borderWidth: 1,
    },
    rowData: {
        flexDirection: 'row',
        height: 40,
    },
    col1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
    },
    col2: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,

    },
    col3: {
        flex: 4,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
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

export default TeamMatches;