import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Avatarm, Input } from 'react-native-elements'
import { Picker } from '@react-native-community/picker'

class AddNewTeams extends Component {
    constructor(props) {
        super(props)
        this.state = {
            province: [], district: [], ward: [],
            selectedProvince: '', selectedDistrict: '', selectedWard: '', userId: '',
            teamName: '', avatarUrl: '', description: '', position: ''
        }
    }

    componentDidMount = async () => {
        await AsyncStorage.getItem('userId').then((token) => {
            this.setState({ userId: token })
        })
        await fetch('http://192.168.1.116:8080/soccerApp/all-province', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((json) => { this.setState({ province: json }); this.setState({ selectedProvince: json[0].id }) });
        this.getListDistrict(this.state.selectedProvince);
    }
    getListDistrict = async (provinceId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/district-by-province', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                provinceId: provinceId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ district: json }); this.setState({ selectedDistrict: json[0].id }) });
        this.getListWard(this.state.selectedDistrict);
    }
    getListWard = async (districtId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/ward-by-district', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                districtId: districtId
            }),
        }).then((response) => response.json())
            .then((json) => { this.setState({ ward: json }) })
    }

    submitTeamInfo = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/add-new-team', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                userId: this.state.userId,
                teamName: this.state.teamName,
                url: this.state.avatarUrl,
                description: this.state.description,
                position: this.state.position,
                ward_id: this.state.selectedWard
            }),
        }).then((response) => response.json())
            .then((json) => { if (json.msg == 'success') { alert("Thêm đội thành công") } else { alert('Có lỗi xảy ra') } })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.leftSide}>
                    <Text style={{ marginTop: 40, fontSize: 18 }}>Tên đội : </Text>
                    <Text style={styles.title}>Link ảnh : </Text>
                    <Text style={styles.title}>Mô tả : </Text>
                    <Text style={styles.title}>Vị trí của bạn : </Text>
                    <Text style={styles.title}>Địa điểm : </Text>
                </View>
                <View style={styles.rightSide}>
                    <Input style={styles.inpField} value={this.state.teamName} onChangeText={text => this.setState({ teamName: text })} placeholder='Enter name'></Input>
                    <Input style={styles.inpField} value={this.state.avatarUrl} onChangeText={text => this.setState({ avatarUrl: text })} placeholder='AvatarURL'></Input>
                    <Input style={styles.inpField} value={this.state.description} onChangeText={text => this.setState({ description: text })} placeholder='Description'></Input>
                    <Input style={styles.inpField} value={this.state.position} onChangeText={text => this.setState({ position: text })} placeholder='Position'></Input>

                    <Text style={{ marginTop: 38 }}>Tỉnh/Thành Phố : </Text>
                    <Picker selectedValue={this.state.selectedProvince}
                        onValueChange={(value) => {
                            this.getListDistrict(value);
                            this.setState({ selectedProvince: value });
                        }}>
                        {this.state.province.map((item, key) =>
                            <Picker.Item label={item.name} value={item.id} key={key}></Picker.Item>
                        )}
                    </Picker>
                    <Text>Quận/Huyện : </Text>
                    <Picker selectedValue={this.state.selectedDistrict}
                        onValueChange={(value) => { this.setState({ selectedDistrict: value }); this.getListWard(value) }}>
                        {this.state.district.map((item, key) =>
                            <Picker.Item label={item.name} value={item.id} key={key}></Picker.Item>
                        )}
                    </Picker>
                    <Text>Xã/Phường : </Text>
                    <Picker selectedValue={this.state.selectedWard}
                        onValueChange={(value) => { this.setState({ selectedWard: value }); }}>
                        {this.state.ward.map((item, key) =>
                            <Picker.Item label={item.name} value={item.id} key={key}></Picker.Item>
                        )}
                    </Picker>

                    <TouchableOpacity style={styles.btnSubmit} onPress={this.submitTeamInfo}>
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


export default AddNewTeams;