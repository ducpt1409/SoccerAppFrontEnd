import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, Button } from 'react-native'
import { SearchBar, Icon, Avatar } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlatList } from 'react-native-gesture-handler';

class AddTeamMember extends Component {

    constructor(props) {
        super(props);
        this.state = { nameUser: '', teamId: '', result: [] }
    }

    componentDidMount() {
        const teamId = this.props.route.params.teamId;
        this.setState({ teamId: teamId })
    }

    findUserByName = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-user-by-name', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.nameUser
            }),
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ result: json })
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <SearchBar placeholder="Nhập tên cầu thủ ..."
                        containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, height: 50, justifyContent: "center", backgroundColor: "#F2F2F2", marginTop: 10 }}
                        inputContainerStyle={{ borderRadius: 30, backgroundColor: "white" }}
                        onChangeText={(text) => this.setState({ nameUser: text })} value={this.state.nameUser}
                        onSubmitEditing={this.findUserByName}
                    />
                </View>
                <View style={styles.body}>
                    <Text>Danh sách cầu thủ</Text>
                    <View style={{
                        flexDirection: 'row', height: 40,
                    }}>
                        <View style={styles.col2}><Text>Avatar</Text></View>
                        <View style={styles.col2}><Text>Ngày sinh</Text></View>
                        <View style={styles.col3}><Text>Tên</Text></View>
                        <View style={styles.col2}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('TeamInformation', { teamId: item.id })}>
                                <Text>Mời vào đội</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList data={this.state.result} renderItem={({ item }) =>
                        <View style={styles.rowData}>
                            <View style={styles.col2}><Avatar size='medium' rounded source={{ uri: item.avatarUrl }} /></View>
                            <View style={styles.col2}><Text>{item.doB}</Text></View>
                            <View style={styles.col3}><Text>{item.name}</Text></View>
                            <View style={styles.col2}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('MakeTeamInvitation', { id: item.id, teamId : this.state.teamId }) }}>
                                    <Text>Mời</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    } keyExtractor={item => item.id.toString()}/>
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
    }
})

export default AddTeamMember;