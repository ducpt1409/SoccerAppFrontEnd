import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-community/picker'
class ChangeTeamInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamId: '', result: [], name: '', avatarUrl: '', introduce: '',
            province: [], district: [], ward: [], sWard: '', sDistrict: '', sProvince: ''
        }
    }

    componentDidMount = async () => {
        const teamId = this.props.route.params.teamId;
        this.setState({ teamId: teamId })
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
                this.setState({ result: json });
                this.setState({ name: json.name });
                this.setState({ avatarUrl: json.avatarUrl });
                this.setState({ introduce: json.description });
                this.setState({ sProvince: json.teamLocationDTO.wardDTO.districtDTO.province.id });
                this.setState({ sDistrict: json.teamLocationDTO.wardDTO.districtDTO.id });
                this.setState({ sWard: json.teamLocationDTO.wardDTO.id })
            });
        this.getAllProvince();
    }

    getAllProvince = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/all-province', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
            .then((json) => { this.setState({ province: json }); });
        this.getListDistrict(this.state.sProvince)
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
            .then((json) => { this.setState({ district: json }); });
        this.getListWard(this.state.sDistrict);
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

    handleUpdate = async () => {
        await fetch('http://192.168.1.116:8080/soccerApp/update-team-info', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                teamId: this.state.teamId,
                teamName: this.state.name,
                avatarUrl: this.state.avatarUrl,
                description: this.state.introduce,
                ward_id: this.state.sWard
            }),
        }).then((response) => response.json())
            .then((json) => { if (json.msg == 'success') { alert("Cập nhật thành công") } else { alert('Có lỗi xảy ra') } })
    }

    render() {
        return (
            <SafeAreaView style={styles.outside}>
                <View style={styles.container}>
                    <View style={styles.tittleField}>
                        <Text style={{ marginTop: 30, marginRight: 20, fontSize: 16 }}>Tên đội: </Text>
                        <Text style={styles.title}>Link Avatar : </Text>
                        <Text style={styles.title}>Giới thiệu : </Text>
                        <Text style={styles.title}>Địa điểm : </Text>
                    </View>
                    <View style={styles.inputField}>
                        <Input style={styles.textInp} value={this.state.name} onChangeText={(text) => { this.setState({ name: text }) }}></Input>
                        <Input style={styles.textInp} value={this.state.avatarUrl} onChangeText={(text) => { this.setState({ avatarUrl: text }) }} ></Input>
                        <Input style={styles.textInp} value={this.state.introduce} onChangeText={(text) => { this.setState({ introduce: text }) }} ></Input>

                        <Text style={{ marginTop: 30 }}>Tỉnh/Thành Phố : </Text>
                        <Picker selectedValue={this.state.sProvince}
                            onValueChange={(value) => {
                                this.getListDistrict(value);
                                this.setState({ sProvince: value });
                            }}>
                            {this.state.province.map((item, key) =>
                                <Picker.Item label={item.name} value={item.id} key={key}></Picker.Item>
                            )}
                        </Picker>
                        <Text>Quận/Huyện : </Text>
                        <Picker selectedValue={this.state.sDistrict}
                            onValueChange={(value) => { this.getListWard(value); this.setState({ sDistrict: value }); }}>
                            {this.state.district.map((item, key) =>
                                <Picker.Item label={item.name} value={item.id} key={key}></Picker.Item>
                            )}
                        </Picker>
                        <Text>Xã/Phường : </Text>
                        <Picker selectedValue={this.state.sWard}
                            onValueChange={(value) => { this.setState({ sWard: value }); }}>
                            {this.state.ward.map((item, key) =>
                                <Picker.Item label={item.name} value={item.id} key={key}></Picker.Item>
                            )}
                        </Picker>
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

export default ChangeTeamInfor;