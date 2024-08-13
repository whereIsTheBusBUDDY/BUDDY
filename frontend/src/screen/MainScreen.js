import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  useWindowDimensions,
  ScrollView,
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  RefreshControl,
  Alert,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageButton, { ButtonColors } from '../components/ImageButton';
import TimeTable from '../components/TimeTable';
import busRoutes from '../data/busRoutes';
import { BLACK, WHITE, SKYBLUE, GRAY } from '../constant/color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import EventSource from 'react-native-event-source';
import { NotificationContext } from '../context/NotificationContext';
import DropdownBus from '../components/Dropdown/DropdownBus';
import {
  fetchProfileData,
  fetchLastNotice,
  checkBusStatus,
  fetchPassengerData,
} from '../api/user';
import { sseUrl } from '../api/url';

const MainScreen = () => {
  const { setHasUnreadNotifications } = useContext(NotificationContext);

  const width = useWindowDimensions().width - 40;
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({});
  const [selectedBus, setSelectedBus] = useState('1호차');
  const [refreshing, setRefreshing] = useState(false);
  const [passengerData, setPassengerData] = useState({});
  const [lastNotice, setLastNotice] = useState('');
  const [lastNoticeCreateAt, setLastNoticeCreateAt] = useState('');
  const [connectMessage, setConnectMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [suggestMessage, setSuggestMessage] = useState('');
  const [arriveMessage, setArriveMessage] = useState('');

  useEffect(() => {
    fetchPassengerDataAsync();
    initializeSSE();
    requestNotificationPermissions();
    fetchLastNoticeAsync();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('알림 권한이 거부되었습니다!');
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const sendNotification = async (title, content) => {
    setHasUnreadNotifications(true);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: content,
      },
      trigger: null,
    });
  };

  const initializeSSE = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('No token found in AsyncStorage');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const eventSource = new EventSource(sseUrl, {
        headers: headers,
      });

      eventSource.onopen = () => {
        console.log('SSE connection opened');
      };

      eventSource.addEventListener('CONNECT', (e) => {
        console.log('client CONNECT event: ', e.data);
        setConnectMessage((prev) => prev + e.data);
      });

      eventSource.addEventListener('NOTICE', (e) => {
        console.log('NOTICE event: ', e.data);
        setNoticeMessage((prev) => prev + e.data);
        sendNotification('BUDDY', '📌 공지사항이 등록되었습니다.');
      });

      eventSource.addEventListener('ARRIVE', (e) => {
        console.log('ARRIVE event: ', e.data);
        setArriveMessage((prev) => prev + e.data);
        sendNotification('BUDDY', `버스가 ${e.data} 정류장에 도착하였습니다.`);
      });

      eventSource.onerror = (e) => {
        console.error('SSE error: ', e);
      };

      return () => {
        eventSource.close();
        console.log('SSE connection closed');
      };
    } catch (error) {
      console.error('Failed to initialize SSE:', error);
    }
  };

  const fetchProfileDataAsync = async () => {
    try {
      const data = await fetchProfileData();
      const mappedData = mapProfileData(data);
      setProfileData(mappedData);
      if (mappedData.선호노선) {
        setSelectedBus(`${mappedData.선호노선}호차`);
      }
      console.log(data);
    } catch (error) {
      console.error('프로필 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchLastNoticeAsync = async () => {
    try {
      const data = await fetchLastNotice();
      setLastNoticeCreateAt(data.createdAt);
      setLastNotice(data.title || '공지사항이 없습니다');
    } catch (error) {
      console.error('마지막 공지사항을 가져오는 중 오류 발생:', error);
      setLastNotice('공지사항을 불러오지 못했습니다.');
    }
  };

  const checkBusStatusAsync = async () => {
    try {
      const status = await checkBusStatus();
      return status;
    } catch (error) {
      console.error('운행 상태 확인 중 오류 발생:', error);
      return false;
    }
  };

  const handleBusLocationPress = async () => {
    const isBusRunning = await checkBusStatusAsync();
    console.log(isBusRunning);
    if (isBusRunning) {
      navigation.navigate('Bus');
    } else {
      Alert.alert('알림', '운행중인 버스가 없습니다.');
    }
  };

  const GoMessage = async () => {
    try {
      const busNumber = await AsyncStorage.getItem('busNumber');
      if (busNumber) {
        navigation.navigate('Message');
      } else {
        Alert.alert('알림', 'QR 스캔 후 이용 가능합니다.');
      }
    } catch (error) {
      console.error('오류 발생', error);
    }
  };

  const fetchPassengerDataAsync = async () => {
    try {
      const data = await fetchPassengerData();
      setPassengerData(data);
    } catch (error) {
      console.error('탑승 인원 정보를 가져오는 중 오류 발생:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileDataAsync();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileDataAsync().then(() => setRefreshing(false));
    fetchPassengerDataAsync();
  }, []);

  const mapProfileData = (data) => {
    return {
      이름: data.name,
      학번: data.studentId,
      이메일: data.email,
      닉네임: data.nickname,
      선호노선: data.favoriteLine,
    };
  };

  const GoChatRoom = async () => {
    try {
      const busNumber = await AsyncStorage.getItem('busNumber');
      if (busNumber) {
        navigation.navigate('Chat', { roomId: busNumber });
      } else {
        Alert.alert('알림', 'QR 스캔 후 이용 가능합니다.');
      }
    } catch (error) {
      console.error('오류 발생', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StatusBar style="dark" />
        <View style={styles.topContainer}>
          <Text style={styles.notice}>공지사항 {'>'}</Text>

          <ImageButton
            title={`${lastNoticeCreateAt} | ${lastNotice}`}
            onPress={() => {
              navigation.navigate('Board');
            }}
            buttonColor={ButtonColors.ORANGE}
            width={width}
            height={40}
            titleFontSize={15}
          />
          <ImageButton
            title={
              <>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {profileData.이름}
                </Text>
                <Text style={{ fontSize: 20 }}>{'님,'}</Text>
                <Text style={{ color: SKYBLUE.FONT, fontSize: 16 }}>
                  {'\n실시간 셔틀버스 위치'}
                </Text>
                <Text style={{ fontSize: 16 }}>{'를 확인해보세요!'}</Text>
              </>
            }
            onPress={handleBusLocationPress}
            buttonColor={ButtonColors.GRAY}
            width={width}
            height={160}
            textAlign="left"
            imageSource={require('../../assets/bus.png')}
            imageWidth={90}
            imageHeight={90}
            titleFontSize={14}
          />
        </View>

        <View style={styles.upperContainer}>
          <View style={styles.upperLeftPad}>
            <ImageButton
              title={'QR 코드로\n 탑승하기'}
              onPress={() => {
                navigation.navigate('Qr');
              }}
              buttonColor={ButtonColors.ORANGE}
              width={width / 2 - 10}
              height={100}
              imageSource={require('../../assets/qr.png')}
              titleFontSize={14}
            />
          </View>
          <View style={styles.upperRightPad}>
            <ImageButton
              title="기사님, 건의할래요!"
              onPress={GoMessage}
              width={width / 2}
              height={45}
              imageSource={require('../../assets/driver.png')}
              imageWidth={30}
              imageHeight={30}
              titleFontSize={14}
            />
            <ImageButton
              title="채팅방 입장하기"
              onPress={GoChatRoom}
              width={width / 2}
              height={45}
              imageSource={require('../../assets/chat.png')}
              imageWidth={30}
              imageHeight={30}
              titleFontSize={14}
            />
          </View>
        </View>

        <View style={styles.middleContainer}>
          <View style={styles.middleLeftPad}>
            <ImageButton
              title="셔틀 노선도"
              onPress={() => {
                navigation.navigate('Map');
              }}
              width={width / 2 - 10}
              height={100}
              imageSource={require('../../assets/map.png')}
              imageWidth={60}
              imageHeight={60}
              titleFontSize={14}
            />
            <ImageButton
              title={'즐겨찾는\n 목적지'}
              onPress={() => {
                navigation.navigate('Favorite');
              }}
              width={width / 2 - 10}
              height={100}
              imageSource={require('../../assets/favorite.png')}
              imageWidth={65}
              imageHeight={50}
              titleFontSize={14}
            />
          </View>
          <View style={styles.middleRightPad}>
            <View style={styles.numOfPeople}>
              <Text style={styles.numOfPeopleText}>실시간 탑승 인원</Text>
              <View style={styles.numOfPeopleBox}>
                {Object.entries(passengerData).map(
                  ([busNumber, passengers]) => (
                    <View key={busNumber} style={styles.numOfPeopleBoxRow}>
                      <Text style={styles.bustext}>{`${busNumber}호차`}</Text>
                      <Text style={styles.bustext}>{`${passengers}명`}</Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.dropdownContainer}>
            <DropdownBus
              selectedValue={selectedBus}
              onChangeValue={setSelectedBus}
              backgroundColor={SKYBLUE.FONT}
            ></DropdownBus>
            <Text style={styles.bottomContainerText}>운행시간표</Text>
          </View>
          <View style={{ width: '100%' }}>
            <TimeTable data={busRoutes[selectedBus]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  topContainer: {},
  notice: {
    fontSize: 16,
    color: BLACK,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  upperContainer: {
    flexDirection: 'row',
  },
  upperLeftPad: {
    flex: 1,
  },
  upperRightPad: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  middleLeftPad: {
    flex: 1,
  },
  middleRightPad: {
    flex: 1,
  },
  numOfPeople: {
    backgroundColor: SKYBLUE.BACKGROUND,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 210,
    justifyContent: 'space-evenly',
  },
  numOfPeopleText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  numOfPeopleBox: {
    flexDirection: 'column',
  },
  numOfPeopleBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: WHITE,
    padding: 2,
    marginBottom: 3,
    marginTop: 3,
    borderRadius: 8,
  },
  bustext: {
    fontSize: 12,
    color: BLACK,
  },
  bottomContainer: {
    backgroundColor: GRAY.BACKGROUND,
    borderRadius: 15,
    alignItems: 'center',
    padding: 30,
    paddingBottom: -30,
    marginBottom: 30,
    zIndex: 0,
  },
  dropdownContainer: {
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    zIndex: 2,
  },
  dropdown: {
    width: 80,
    paddingVertical: 5,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: SKYBLUE.FONT,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: WHITE,
  },
  dropdownBox: {
    width: 80,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: WHITE,
  },
  dropdownBoxText: {
    fontSize: 16,
    padding: 10,
  },
  bottomContainerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default MainScreen;
