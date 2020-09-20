import React, { Component } from 'react'
import { } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import ChangePersonalInfor from './screens/ChangePersonalInfor'
import SignIn from './screens/SignIn'
import SignUp from './screens/SignUp'
import Home from './screens/Home'
import AddNewTeam from './screens/AddNewTeam'
import TeamInformation from './screens/TeamInfomation'
import ChangeTeamInfo from './screens/ChangeTeamInfo'
import PlayerInfo from './screens/PlayerInfo'
import AddTeamMember from './screens/AddTeamMember'
import MakeTeamInvitation from './screens/MakeTeamInvitation'
import TeamInvitation from './screens/TeamInvitation'
import MatchMaking from './screens/MatchMaking'
import TeamMaches from './screens/TeamMatches'
import InviteTeamToMatch from './screens/InviteTeamToMatch'
import MatchInvitations from './screens/MatchInvitations'
import ChallengeInvitation from './screens/ChallengeInvitation'
import MatchResult from './screens/MatchResult'

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='SignIn' component={SignIn} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
          <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name='ChangePersonalInfor' component={ChangePersonalInfor} options={{ title: 'Thay đổi thông tin cá nhân' }} />
          <Stack.Screen name='AddNewTeam' component={AddNewTeam} options={{ title: 'Thêm đội bóng mới' }} />
          <Stack.Screen name='TeamInformation' component={TeamInformation} options={{ title: 'Thông tin đội bóng' }} />
          <Stack.Screen name='ChangeTeamInfo' component={ChangeTeamInfo} options={{ title: 'Đổi thông tin đội bóng' }} />
          <Stack.Screen name='PlayerInfo' component={PlayerInfo} options={{ title: 'Thông tin cầu thủ' }} />
          <Stack.Screen name='AddTeamMember' component={AddTeamMember} options={{ title: 'Thêm thành viên' }} />
          <Stack.Screen name='MakeTeamInvitation' component={MakeTeamInvitation} options={{ title: 'Tạo lời mời' }} />
          <Stack.Screen name='TeamInvitation' component={TeamInvitation} options={{ title: 'Lời mời thành viên' }} />
          <Stack.Screen name='TeamMaches' component={TeamMaches} options={{ title: 'Các trận đấu của đội' }} />
          <Stack.Screen name='MatchMaking' component={MatchMaking} options={{ title: 'Tạo trận đấu' }} />
          <Stack.Screen name='InviteTeamToMatch' component={InviteTeamToMatch} options={{ title: 'Tìm và mời vào trận' }} />
          <Stack.Screen name='MatchInvitations' component={MatchInvitations} options={{ title: 'Tất cả lời mời thi đấu' }} />
          <Stack.Screen name='ChallengeInvitation' component={ChallengeInvitation} options={{ title: 'Lời mời thi đấu' }} />
          <Stack.Screen name='MatchResult' component={MatchResult} options={{ title: 'Cập nhật kết quả trận đấu' }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}