import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { Icon, Avatar, Input } from 'react-native-elements'

class MatchMaking extends Component {

    constructor(props) {
        super(props);
        this.state = { teamId: '', matchName: '', location: '', time: '', note: '' }
    }

    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        this.setState({ teamId: teamId })
    }

    handleMakeMatch = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/make-new-match', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                teamId: this.state.teamId,
                matchName: this.state.matchName,
                location: this.state.location,
                time: this.state.time,
                note: this.state.note
            }),
        }).then((response) => response.json())
            .then((json) => { if (json.msg == 'success') { alert("Tạo trận đấu thành công") } else {alert("Có lỗi xảy ra")} })
            .catch((error) => { alert('Có lỗi xảy ra') });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.leftSide}>
                    <Text style={{ marginTop: 40, fontSize: 18 }}>Tên trận đấu : </Text>
                    <Text style={styles.title}>Địa điểm: </Text>
                    <Text style={styles.title}>Thời gian : </Text>
                    <Text style={styles.title}>Mô tả : </Text>
                </View>
                <View style={styles.rightSide}>
                    <Input style={styles.inpField} value={this.state.matchName} onChangeText={(text) => this.setState({ matchName: text })} placeholder='Match name'></Input>
                    <Input style={styles.inpField} value={this.state.location} onChangeText={(text) => this.setState({ location: text })} placeholder='Location'></Input>
                    <Input style={styles.inpField} value={this.state.time} onChangeText={(text) => this.setState({ time: text })} placeholder='Time'></Input>
                    <Input style={styles.inpField} value={this.state.note} onChangeText={(text) => this.setState({ note: text })} placeholder='Note'></Input>

                    <TouchableOpacity style={styles.btnSubmit} onPress={this.handleMakeMatch}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Tạo trận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
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
        marginTop: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: 'center'
    }

})


export default MatchMaking;