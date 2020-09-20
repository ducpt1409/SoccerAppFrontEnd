import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native'
import { Icon } from 'react-native-elements'
import { Input } from 'react-native-elements';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = { accId: "", username: "", password: "", oldPass: "", newPass1: "", newPass2: "" }
    }

    componentDidMount = async () => {
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
        await fetch('http://192.168.1.116:8080/soccerApp/getUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.userId
            }),
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ accId: json.accountDTO.id });
                this.setState({ username: json.accountDTO.username });
                this.setState({ password: json.accountDTO.password });
            });
    }

    handleUpdate = async () => {
        if (this.state.oldPass != this.state.password) {
            alert('Nhập sai mật khẩu cũ, vui lòng thử lại')
        } else if (this.state.newPass1 != this.state.newPass2) {
            alert('Mật khẩu mới không khớp, vui lòng thử lại')
        } else {
            await fetch('http://192.168.1.116:8080/soccerApp/updatePassword', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.state.accId,
                    username: this.state.username,
                    password: this.state.newPass1,
                }),
            }).then((response) => response.json())
                .then((json) => {
                    if (json.msg == "error") {
                        alert('Có lỗi xảy ra');
                    } else {
                        alert("Cập nhật thành công")
                    }
                });
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Icon iconStyle={{ marginLeft: 10 }} size={40} name="menu-outline" type="ionicon" color="black" onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()) }} />
                    </View>
                    <View style={{ alignItems: "center", width: '80%' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Đổi mật khẩu</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <Text style={{ marginBottom: 30, marginLeft: 13, fontSize: 18 }}>Tên đăng nhập : {this.state.username}</Text>
                    <Text style={styles.title}>Nhập mật khẩu cũ</Text>
                    <Input placeholder='Enter Old Password' secureTextEntry={true} onChangeText={text => this.setState({ oldPass: text })}></Input>
                    <Text style={styles.title}>Nhập mật khẩu mới</Text>
                    <Input placeholder='Enter New Password' secureTextEntry={true} onChangeText={text => this.setState({ newPass1: text })}></Input>
                    <Text style={styles.title}>Xác nhận mật khẩu mới</Text>
                    <Input placeholder='Enter New Password Again' secureTextEntry={true} onChangeText={text => this.setState({ newPass2: text })}></Input>
                    <TouchableOpacity style={styles.btnSubmit} onPress={this.handleUpdate}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Update</Text>
                    </TouchableOpacity>
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
        marginTop: 30
    },
    title: {
        marginLeft: 13,
        fontSize: 18,
    },
    btnSubmit: {
        backgroundColor: '#FF8000',
        borderWidth: 0,
        height: 40,
        width: 200,
        margin: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: 'center',
        marginLeft: "27%"
    }
})

export default ChangePassword;