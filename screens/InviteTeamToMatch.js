import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, Modal, Button } from 'react-native'
import { SearchBar, Icon, Avatar, Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlatList } from 'react-native-gesture-handler';

class InviteTeamToMatch extends Component {

    constructor(props) {
        super(props);
        this.state = { matchId: '', teamName: '', teamInvite: '', result: [], selectedItem: {}, modalIsOpen: false, note: '' }
    }

    componentDidMount() {
        const matchId = this.props.route.params.matchId;
        this.setState({ matchId: matchId })
    }

    findTeamByName = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-teams-by-name', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName: this.state.teamName
            }),
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ result: json })
            });
    }

    sendMatchInvitation = async () => {
        const date = new Date();
        let timeSend = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        await fetch('http://192.168.1.116:8080/soccerApp/make-match-invitation', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamInvite: this.state.teamInvite,
                matchId: this.state.matchId,
                type: '1',
                time: timeSend,
                note: this.state.note
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == 'success') { alert('Gửi lời mời thành công') } else { alert('Có lỗi xảy ra vui lòng thử lại') }
            }).catch((error) => alert('Đã xảy ra lỗi'));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <SearchBar placeholder="Nhập tên đội mời ..."
                        containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, height: 50, justifyContent: "center", backgroundColor: "#F2F2F2", marginTop: 10 }}
                        inputContainerStyle={{ borderRadius: 30, backgroundColor: "white" }}
                        onChangeText={(text) => this.setState({ teamName: text })} value={this.state.teamName}
                        onSubmitEditing={this.findTeamByName}
                    />
                </View>
                <View style={styles.body}>
                    <Text>Danh sách đội bóng</Text>
                    <View style={{
                        flexDirection: 'row', height: 40,
                    }}>
                        <View style={styles.col2}><Text>Logo</Text></View>
                        <View style={styles.col2}><Text>Tên đội</Text></View>
                        <View style={styles.col3}><Text>Địa điểm</Text></View>
                        <View style={styles.col2}>
                            <TouchableOpacity>
                                <Text>Tạo lời mời</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList data={this.state.result} renderItem={({ item }) =>
                        <View style={styles.rowData}>
                            <View style={styles.col2}><Avatar size='medium' rounded source={{ uri: item.avatarUrl }} /></View>
                            <View style={styles.col2}><Text>{item.name}</Text></View>
                            <View style={styles.col3}><Text>{item.teamLocationDTO.wardDTO.districtDTO.province.name} - {item.teamLocationDTO.wardDTO.districtDTO.name} - {item.teamLocationDTO.wardDTO.name}</Text></View>
                            <View style={styles.col2}>
                                <TouchableOpacity onPress={() => { this.setState({ selectedItem: item }); this.setState({ modalIsOpen: true }) }}>
                                    <Text>Mời</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    } keyExtractor={item => item.id.toString()} />

                    <Modal animationType="fade" onRequestClose={() => { this.setState({ modalIsOpen: false }) }}
                        visible={this.state.modalIsOpen} transparent>
                        <View style={styles.modalStyle}>
                            <Text>Thông tin đội </Text>
                            <Text>Tên đội : {this.state.selectedItem.name}</Text>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ marginLeft: 12, fontSize: 18 }}>Nhập lời mời : </Text>
                                <Input value={this.state.note} placeholder="Lời mời ..." onChangeText={(text) => this.setState({ note: text })} />
                            </View>
                            <Button title="Gửi lời mời" onPress={async () => { await this.setState({ teamInvite: this.state.selectedItem.id }); this.sendMatchInvitation(); this.setState({ modalIsOpen: false }) }}></Button>
                        </View>
                    </Modal>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    searchBar: {
        height: 70,
        width: "100%"
    },
    body: {
        flex: 1
    },
    rowData: {
        flexDirection: 'row',
        height: 60,
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
        width: '90%',
        borderWidth: 1,
        borderRadius: 30,
        marginLeft: '5%',
        backgroundColor: 'white',
        padding: 30,
        marginTop: 100
    }
})

export default InviteTeamToMatch;