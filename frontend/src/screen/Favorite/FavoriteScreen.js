import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabButton from '../../components/BoardTabButton';
import { PRIMARY, WHITE, GRAY } from '../../constant/color';
import Pagename from '../../components/PageName';

const MyFavorites = () => (
  <View style={styles.contentContainer}>
    <View style={styles.listContainer}>
      <Text style={styles.item}>
        연구단지 네거리(대덕고등학교 버스정류장) ★
      </Text>
      <Text style={styles.item}>월평역(유림공원방면) 버스정류장 ★</Text>
      <Text style={styles.item}>우송대학교 서캠퍼스 버스정류장 ★</Text>
    </View>
  </View>
);

const RegisterFavorites = () => (
  <View style={styles.contentContainer}>
    <View style={styles.listContainer}>
      <Text style={styles.item}>1호차</Text>
      <Text style={styles.item}>오정동 목요 앞(국민연금북대전지사) ★</Text>
      <Text style={styles.item}>재들네거리(샘머리아파트 부근) ★</Text>
      <Text style={styles.item}>정부청사역 4번 출구 앞 ★</Text>
      <Text style={styles.item}>갈마역 ★</Text>
      <Text style={styles.item}>월평역(유림공원방면) 버스정류장 ★</Text>
      <Text style={styles.item}>GS 셀프 충대 앞 주유소 ★</Text>
      <Text style={styles.item}>유성문화원 ★</Text>
    </View>
  </View>
);

const FavoriteScreen = () => {
  const [activeTab, setActiveTab] = useState('MyFavorites');
  return (
    <View style={styles.container}>
      {/* <Pagename title="< 게시판" /> */}
      <Text style={styles.title}>
        {activeTab === 'MyFavorites'
          ? '김싸피님이 즐겨찾는 목적지예요!'
          : '김싸피님, 하차 알림을 받으시려면 즐겨찾는 목적지를 등록해주세요!'}
      </Text>
      <View style={styles.tabContainer}>
        <TabButton
          title="나의 즐겨찾기"
          isActive={activeTab === 'MyFavorites'}
          onPress={() => setActiveTab('MyFavorites')}
        />
        <TabButton
          title="즐겨찾기 등록"
          isActive={activeTab === 'RegisterFavorites'}
          onPress={() => setActiveTab('RegisterFavorites')}
        />
      </View>
      {activeTab === 'MyFavorites' ? <MyFavorites /> : <RegisterFavorites />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 30,
    // borderBottomWidth: 1,
    // borderColor: GRAY,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: PRIMARY.DEFAULT,
    marginVertical: 20,
    textAlign: 'center',
  },
  listContainer: {
    width: '90%',
    backgroundColor: GRAY.BACKGROUND,
    borderRadius: 10,
    padding: 10,
    // marginTop: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 8,
    // borderBottomWidth: 1,
    borderColor: GRAY,
  },
});

export default FavoriteScreen;
