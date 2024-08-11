import React, { useState, useCallback, useEffect } from 'react';
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
import ModalDropdown from 'react-native-modal-dropdown';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageButton, { ButtonColors } from '../components/ImageButton';
import TimeTable from '../components/TimeTable';
import busRoutes from '../data/busRoutes';
import { BLACK, WHITE, SKYBLUE, GRAY } from '../constant/color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/api';
import EventSource from 'react-native-event-source';

const MainScreen = () => {
  const width = useWindowDimensions().width - 40;
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({});
  const [selectedBus, setSelectedBus] = useState('1호차');
  const [refreshing, setRefreshing] = useState(false);
  const [passengerData, setPassengerData] = useState({});
  const items = ['1호차', '2호차', '3호차', '4호차', '5호차', '6호차'];

  const [connectMessage, setConnectMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [suggestMessage, setSuggestMessage] = useState('');
  const [arriveMessage, setArriveMessage] = useState('');

  useEffect(() => {
    fetchPassengerData();
    initializeSSE(); // Initialize SSE when the component mounts
    requestNotificationPermissions(); // Request notification permissions
    sendNotification();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('알림 권한이 거부되었습니다!');
    }
  };

  // Set up notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // ✅ 알림 전송
  const sendNotification = async (title, content) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: content,
      },
      trigger: null, // 즉시 보내려면 'trigger'에 'null'을 설정
    });
  };

  const initializeSSE = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.error('No token found in AsyncStorage');
        return;
      }

      // console.log('Access Token:', token);

      const sseUrl = 'http://i11b109.p.ssafy.io:8080/subscribe';

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
        console.log('액세스 토큰 ::::', AsyncStorage.getItem('accessToken'));
        console.log('액세스 토큰 ::::::222222222', token);
        setConnectMessage((prev) => prev + e.data);
        // sendNotification('BUDDY', '공지사항이 등록되었습니다.');
      });

      eventSource.addEventListener('NOTICE', (e) => {
        console.log('NOTICE event: ', e.data);
        setNoticeMessage((prev) => prev + e.data);
        sendNotification('BUDDY', '📌 공지사항이 등록되었습니다.');
      });

      eventSource.addEventListener('ARRIVE', (e) => {
        console.log('ARRIVE event: ', e.data);
        setArriveMessage((prev) => prev + e.data);
        sendNotification('BUDDY', '');
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

  const fetchProfileData = async () => {
    try {
      const response = await apiClient.get('/members/me');
      const mappedData = mapProfileData(response.data);
      setProfileData(mappedData);
      if (mappedData.선호노선) {
        setSelectedBus(`${mappedData.선호노선}호차`);
      }
      console.log(response.data);
    } catch (error) {
      console.error('프로필 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchPassengerData = async () => {
    try {
      const response = await apiClient.get('/boarding');
      setPassengerData(response.data);
    } catch (error) {
      console.error('탑승 인원 정보를 가져오는 중 오류 발생:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData().then(() => setRefreshing(false));
    fetchPassengerData();
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

  const handleSelect = (index, value) => {
    setSelectedBus(value);
  };

  const adjustFrame = (style) => {
    return {
      ...style,
      left: style.left - 20,
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
            title={'07:00 | 1호차, 6호차는 유성온천역부터 운행합니다.'}
            onPress={() => {
              navigation.navigate('Board');
            }}
            buttonColor={ButtonColors.ORANGE}
            width={width}
            height={40}
            titleFontSize={12}
          />
          <ImageButton
            title={
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  {profileData.이름}
                </Text>
                <Text style={{ fontSize: 18 }}>{'님,'}</Text>
                <Text style={{ color: SKYBLUE.FONT }}>
                  {'\n실시간 셔틀버스 위치'}
                </Text>
                <Text>{'를 확인해보세요!'}</Text>
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
              titleFontSize={13}
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
              titleFontSize={12}
            />
            <ImageButton
              title="채팅방 입장하기"
              onPress={GoChatRoom}
              width={width / 2}
              height={45}
              imageSource={require('../../assets/chat.png')}
              imageWidth={30}
              imageHeight={30}
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
              titleFontSize={13}
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
              titleFontSize={13}
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
            <ModalDropdown
              options={items}
              onSelect={handleSelect}
              defaultValue={selectedBus}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownBox}
              dropdownTextStyle={styles.dropdownBoxText}
              adjustFrame={adjustFrame}
            />
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
  },
});

export default MainScreen;
