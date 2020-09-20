import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
class ChangePersonalInfor extends Component {
    constructor(props) {
        super(props);
        this.state = { id: '', name: '', doB: '', location: '', email: '', phone: '', avatarUrl: '', introduce: '' }
    }

    componentDidMount() {
        const info = this.props.route.params.info;
        this.setState({ id: info.id });
        this.setState({ name: info.name });
        this.setState({ doB: info.doB });
        this.setState({ location: info.location });
        this.setState({ email: info.email });
        this.setState({ phone: info.phone });
        this.setState({ avatarUrl: info.avatarUrl });
        this.setState({ introduce: info.introduce });
    }

    handleUpdate = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/updateUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                doB: this.state.doB,
                location: this.state.location,
                email: this.state.email,
                phone: this.state.phone,
                avatarUrl: this.state.avatarUrl,
                introduce: this.state.introduce
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

    render() {
        return (
            <SafeAreaView style={styles.outside}>
                <View style={styles.container}>
                    <View style={styles.tittleField}>
                        <Text style={{ marginTop: 30, marginRight: 20, fontSize: 16 }}>Tên : </Text>
                        <Text style={styles.title}>Ngày sinh : </Text>
                        <Text style={styles.title}>Địa chỉ : </Text>
                        <Text style={styles.title}>Email : </Text>
                        <Text style={styles.title}>Điện thoại : </Text>
                        <Text style={styles.title}>Link Avatar : </Text>
                        <Text style={styles.title}>Giới thiệu : </Text>

                    </View>
                    <View style={styles.inputField}>
                        <Input style={styles.textInp} value={this.state.name} onChangeText={text => this.setState({ name: text })}></Input>
                        <Input style={styles.textInp} value={this.state.doB} onChangeText={text => this.setState({ doB: text })}></Input>
                        <Input style={styles.textInp} value={this.state.location} onChangeText={text => this.setState({ location: text })}></Input>
                        <Input style={styles.textInp} value={this.state.email} onChangeText={text => this.setState({ email: text })}></Input>
                        <Input style={styles.textInp} value={this.state.phone} onChangeText={text => this.setState({ phone: text })}></Input>
                        <Input style={styles.textInp} value={this.state.avatarUrl} onChangeText={text => this.setState({ avatarUrl: text })}></Input>
                        <Input style={styles.textInp} value={this.state.introduce} onChangeText={text => this.setState({ introduce: text })}></Input>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.btnSubmit} onPress={this.handleUpdate}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Update</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    outside: {
        flex: 1,
    },
    container: {
        flex: 8,
        flexDirection: "row",
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    tittleField: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: "flex-start",
    },
    title: {
        marginRight: 20,
        marginTop: 58,
        fontSize: 16
    },
    inputField: {
        flex: 2,
        alignContent: 'center',
        justifyContent: "flex-start"
    },
    textInp: {
        marginTop: 5
    },
    btnSubmit: {
        backgroundColor: '#FF8000',
        borderWidth: 0,
        height: 40,
        width: 200,
        margin: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: 'center'
    }

})

export default ChangePersonalInfor;