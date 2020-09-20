import React, { Component } from 'react'
import { Text, View, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import { Input } from 'react-native-elements';
class MatchResult extends Component {
    constructor(props) {
        super(props);
        this.state = { scoreBoard: {}, match: {}, scoreId: '0', finalScore: '', totalMinute: '', penaltyScore: '', note: '', url: '' }
    }

    componentDidMount = async () => {
        const matchId = this.props.route.params.matchId;
        this.getMatch(matchId);
        this.getScoreBoard(matchId);
    }

    getMatch = async (matchId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-match-by-id', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: matchId
            }),
        }).then((response) => response.json())
            .then((json) => {
                this.setState({ match: json })
            }).catch((exception) => { alert('Có lỗi xảy ra') });
    }

    getScoreBoard = async (matchId) => {
        await fetch('http://192.168.1.116:8080/soccerApp/get-score-board', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: matchId
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.id != 0) {
                    this.setState({ url: 'http://192.168.1.116:8080/soccerApp/update-score-board' })
                    this.setState({ scoreId: json.id })
                    this.setState({ finalScore: json.finalScore })
                    this.setState({ totalMinute: json.totalMinute.toString() })
                    this.setState({ penaltyScore: json.penaltyScore })
                    this.setState({ note: json.note })
                } else {
                    this.setState({ url: 'http://192.168.1.116:8080/soccerApp/add-new-score-board' })
                }
            }).catch((exception) => { alert('Có lỗi xảy ra') });
    }

    handleUpdateResult = async (url) => {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matchId: this.state.match.id,
                scoreBoardId: this.state.scoreId,
                finalScore: this.state.finalScore,
                totalMinute: this.state.totalMinute,
                penaltyScore: this.state.penaltyScore,
                note: this.state.note
            }),
        }).then((response) => response.json())
            .then((json) => {
                if (json.msg == "error") {
                    alert('Có lỗi xảy ra, vui lòng thử lại');
                } else {
                    alert("Cập nhật thành công")
                }
            }).catch((exception) => { alert('Có lỗi xảy ra'); });
    }

    render() {
        return (
            <SafeAreaView style={styles.outside}>
                <View style={styles.container}>
                    <View style={styles.tittleField}>
                        <Text style={{ marginTop: 30, marginRight: 20, fontSize: 16 }}>Tên trận: </Text>
                        <Text style={styles.title}>Tỉ số : </Text>
                        <Text style={styles.title}>Tổng thời gian: </Text>
                        <Text style={styles.title}>Tỉ số Penalty : </Text>
                        <Text style={styles.title}>Chi tiết : </Text>
                    </View>
                    <View style={styles.inputField}>
                        <Input style={styles.textInp} disabled value={this.state.match.match_name}></Input>
                        <Input style={styles.textInp} placeholder='score' value={this.state.finalScore} onChangeText={text => this.setState({ finalScore: text })}></Input>
                        <Input style={styles.textInp} placeholder='total minute' value={this.state.totalMinute} onChangeText={text => this.setState({ totalMinute: text })}></Input>
                        <Input style={styles.textInp} placeholder='penalty score' value={this.state.penaltyScore} onChangeText={text => this.setState({ penaltyScore: text })}></Input>
                        <Input style={styles.textInp} placeholder='note' value={this.state.note} onChangeText={text => this.setState({ note: text })}></Input>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.btnSubmit} onPress={() => this.handleUpdateResult(this.state.url)}>
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

export default MatchResult;