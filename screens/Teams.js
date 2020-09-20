import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { Icon, Avatar } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = { userId: '', result: [] }
    }

    componentDidMount = async () => {
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
        this.loadTeams();
    }

    loadTeams = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-teams-by-user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.state.userId
            }),
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ result: json })
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Icon iconStyle={{ marginLeft: 10 }} size={40} name="menu-outline" type="ionicon" color="black" onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()) }} />
                    </View>
                    <View style={{ alignItems: "center", width: '80%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Đội bóng của bạn</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.table}>
                        <View style={styles.rowTitle}>
                            <View style={styles.col1}><Text>ID</Text></View>
                            <View style={styles.col2}><Text>Logo</Text></View>
                            <View style={styles.col3}><Text>Tên đội</Text></View>
                            <View style={styles.col1}><Text>Chi tiết</Text></View>
                        </View>
                        <FlatList data={this.state.result} renderItem={({ item }) =>
                            <View style={styles.rowData}>
                                <View style={styles.col1}><Text>{item.id}</Text></View>
                                <View style={styles.col2}><Avatar size='medium' rounded source={{ uri: item.avatarUrl }} /></View>
                                <View style={styles.col3}><Text>{item.name}</Text></View>
                                <View style={styles.col1}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('TeamInformation', { teamId : item.id })}>
                                        <Text>Xem</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        } keyExtractor={item => item.id.toString()}/>
                        <TouchableOpacity onPress={this.loadTeams}>
                            <Text>Reload</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonSide}>
                        <TouchableOpacity style={styles.btnSubmit} onPress={() => this.props.navigation.navigate('AddNewTeam')}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Thêm đội bóng mới</Text>
                        </TouchableOpacity>
                    </View>

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
        justifyContent: 'flex-start',
    },
    btnSubmit: {
        backgroundColor: 'blue',
        borderWidth: 0,
        height: 40,
        width: 200,
        marginLeft: "28%",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: 'center'
    },
    table: {
        flex: 9,
        flexDirection: 'column',
    },
    buttonSide: {
        flex: 1,
        flexDirection: 'column',
    },
    rowTitle: {
        flexDirection: 'row',
        height: 30,
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


export default Teams;