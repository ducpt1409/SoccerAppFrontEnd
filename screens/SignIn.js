import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Button, Alert, ImageBackground } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
export default class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = { username: '', password: '', errorMessage: '', result: [] }
    }
    handleLogin = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ result: json }) }).catch((error) => {
                alert('Có lỗi xảy ra. Vui lòng thử lại sau')
            });
        if (this.state.result.length == 1) {
            await AsyncStorage.setItem('userId', this.state.result[0].id.toString());
            this.props.navigation.navigate('Home');
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu')
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.background} source={require('../img/bg.jpg')} imageStyle={{ opacity: 0.5 }}>
                    <View style={styles.header}>
                        <Text style={styles.pageName}>Soccer with Friends</Text>
                    </View>
                    <View style={styles.body}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 20 }}>Sign In</Text>
                        <TextInput style={styles.textInput} autoCapitalize='none'
                            placeholder='Enter Username' onChangeText={text => this.setState({ username: text })}
                            value={this.state.username} blurOnSubmit={true}
                            placeholderTextColor='black'
                        />
                        <TextInput style={styles.textInput} autoCapitalize='none' secureTextEntry
                            placeholder='Enter Password' onChangeText={text => this.setState({ password: text })}
                            blurOnSubmit={true} placeholderTextColor='black' value={this.state.password}
                        />
                        <TouchableOpacity style={styles.btnSubmit} onPress={this.handleLogin}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Login</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>Don't have Account ?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                            <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>Click here</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        <Text>Developed by Pham Tien Duc</Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    pageName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#B40431'
    },
    textInput: {
        height: 50,
        width: '90%',
        borderWidth: 2,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 30,
        paddingLeft: 20
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
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: "center",
    }
})