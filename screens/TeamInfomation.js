import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, RefreshControl, Button, TouchableOpacity } from 'react-native'
import { Icon, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';


class TeamInforMation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '', teamId: '', name: 'abv', avatarUrl: '', ward: '', district: '', province: '',
            description: '', achievement: '', listPlayer: []
        };
    }

    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        this.loadTeam(teamId);

        await this.setState({ teamId: teamId });

        this.getPlayerList();
    }

    loadTeam = async (teamId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-team-by-id', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamId: teamId
            }),
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ name: json.name });
                this.setState({ avatarUrl: json.avatarUrl });
                this.setState({ ward: json.teamLocationDTO.wardDTO.name });
                this.setState({ district: json.teamLocationDTO.wardDTO.districtDTO.name });
                this.setState({ province: json.teamLocationDTO.wardDTO.districtDTO.province.name });
                this.setState({ description: json.description })
                this.setState({ achievement: json.achievement })
            });
    }

    getPlayerList = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-list-teamplayer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamId: this.state.teamId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ listPlayer: json }) });

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.avatarPart}>
                    <Avatar size='xlarge' rounded source={this.state.avatarUrl ? { uri: this.state.avatarUrl } : null}></Avatar>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.name}</Text>
                </View>
                <View style={styles.inforPart}>
                    <Text> Khu vực : {this.state.province} - {this.state.district} - {this.state.ward}</Text>
                    <Text> Giới thiệu : {this.state.description}</Text>
                    <Text> Hiệu suất (Thắng/Tổng) : {this.state.achievement.toString()}</Text>

                    <Text>Danh sách thành viên : </Text>

                    <View style={styles.rowData}>
                        <View style={styles.col1}><Text>STT</Text></View>
                        <View style={styles.col1}><Text>Avatar</Text></View>
                        <View style={styles.col3}><Text>Tên</Text></View>
                        <View style={styles.col2}><Text>Vị trí</Text></View>
                        <View style={styles.col1}><Text>Chi tiết</Text></View>
                    </View>
                    <FlatList data={this.state.listPlayer} renderItem={({ item, index }) =>
                        <View style={styles.rowData}>
                            <View style={styles.col1}><Text>{index}</Text></View>
                            <View style={styles.col1}><Avatar size='small' rounded source={{ uri: 'abc.jpg' }} /></View>
                            <View style={styles.col3}><Text>{item.userDTO.name}</Text></View>
                            <View style={styles.col2}><Text>{item.position}</Text></View>
                            <View style={styles.col1}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('PlayerInfo', { id: item.userDTO.id }) }}>
                                    <Text>Xem</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    } keyExtractor={item => item.id.toString()}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ChangeTeamInfo', { teamId: this.state.teamId }) }}>
                            <Text style={{ color: 'blue' }}>Sửa thông tin đội</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('AddTeamMember', { teamId: this.state.teamId }) }}>
                            <Text style={{ color: 'blue' }}>Thêm thành viên</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('TeamInvitation', { teamId: this.state.teamId }) }}>
                            <Text style={{ color: 'blue' }}>Lời mời thành viên</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ChallengeInvitation', { teamId: this.state.teamId }) }}>
                            <Text style={{ color: 'blue' }}>Lời mời thi đấu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('TeamMaches', { teamId: this.state.teamId }) }}>
                            <Text style={{ color: 'blue' }}>Trận đấu của đội</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
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
    }
})

export default TeamInforMation;