import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Alert, ImageBackground } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default class SignUp extends Component {
    state = { username: '', name: '', password1: '', password2: '', errorMessage: '', result: {} }
    handleSignUp = async () => {
        console.log('Handle SignUp')

        if (this.state.password1 != this.state.password2) this.setState({ errorMessage: 'Mật khẩu không khớp' })
        else {
            await fetch('http://192.168.0.100:8080/soccerApp/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password1,
                    name: this.state.name
                }),
            }).then((response) => response.json())
                .then((json) => { this.setState({ result: json }); console.log(this.state.result.msg) });
            if (this.state.result.msg == "exist") {
                alert('Tên đăng nhập đã tồn tại');
            } else if (this.state.result.msg == "success") {
                await AsyncStorage.setItem('userId', this.state.result.userId);
                this.props.navigation.navigate('Home');
            }
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
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Sign Up</Text>
                        <TextInput style={styles.textInput} autoCapitalize='none'
                            placeholder='Enter Username' onChangeText={text => this.setState({ username: text })}
                            value={this.state.username} blurOnSubmit={true}
                            placeholderTextColor='black'
                        />
                        <TextInput style={styles.textInput} autoCapitalize='none'
                            placeholder='Enter Your Name' onChangeText={text => this.setState({ name: text })}
                            value={this.state.name} blurOnSubmit={true}
                            placeholderTextColor='black'
                        />
                        <TextInput style={styles.textInput} autoCapitalize='none' secureTextEntry
                            placeholder='Enter Password' onChangeText={text => this.setState({ password1: text })}
                            blurOnSubmit={true} placeholderTextColor='black'
                        />
                        <TextInput style={styles.textInput} autoCapitalize='none' secureTextEntry
                            placeholder='Enter Password Again' onChangeText={text => this.setState({ password2: text })}
                            blurOnSubmit={true} placeholderTextColor='black'
                        />
                        <Text style={{ fontSize: 20, color: 'red' }}>{this.state.errorMessage}</Text>
                        <TouchableOpacity style={styles.btnSubmit} onPress={this.handleSignUp}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Sign up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
                            <Text style={{ fontSize: 14, textDecorationLine: 'underline' }}>Go back</Text>
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
        fontSize: 35,
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