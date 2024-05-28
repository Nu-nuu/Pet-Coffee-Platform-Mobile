import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, ICONS, SIZES} from '../../constants';
import {useNavigation} from '@react-navigation/native';

const CafeListComponent = props => {
  const navigation = useNavigation();
  const {petType, shops, data, title} = props;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (shops) {
      setItems(shops);
      if (petType !== '') {
        setItems(shops.filter(shop => shop.type === petType));
      }
    }
    if (data.length !== 0) {
      setItems(data);
      if (petType !== '') {
        setItems(data.filter(shop => shop.type === petType));
      }
    }
  }, [petType, shops, data]);

  return (
    <View style={styles.box}>
      {shops.length === 0 && (
        <View style={[styles.container]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      )}
      <ScrollView
        style={{marginTop: SIZES.m}}
        showsVerticalScrollIndicator={false}>
        {items.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ShopDetail', {id: item.id})}
              key={index}
              style={styles.shopContainer}>
              {item.avatarUrl ? (
                <Image
                  source={{
                    uri: item.avatarUrl,
                  }}
                  style={styles.shopImage}
                />
              ) : null}
              <View style={styles.shopDetail}>
                <View style={styles.shopCategory}>
                  <Text>
                    {item.type === 'Cat'
                      ? 'Cat'
                      : item.type === 'Dog'
                      ? 'Dog'
                      : 'Cat and Dog'}{' '}
                    Cafe
                  </Text>
                  <Ionicons name="paw" size={ICONS.xs} color={COLORS.primary} />
                </View>
                <Text style={styles.shopTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.shopHeader}>
                  <View style={[styles.shopDistance, styles.shopHeader]}>
                    <Ionicons name="navigate-circle" size={15} color={'blue'} />
                    <Text style={styles.shopText}>
                      {item?.distance?.toFixed(2)} Km
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CafeListComponent;

const styles = StyleSheet.create({
  box: {},
  container: {
    marginTop: SIZES.m,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: SIZES.xl - 2,
    color: 'black',
  },
  shopContainer: {
    marginBottom: 20,
    borderRadius: SIZES.m,
    backgroundColor: COLORS.white,
    elevation: 5,
    marginLeft: 2,
    marginRight: 2,
  },
  shopImage: {
    borderRadius: SIZES.s,
    height: 200,
    width: '100%',
    objectFit:'cover'
  },
  shopDetail: {
    padding: SIZES.s,
  },
  shopTitle: {
    fontWeight: 'bold',
    fontSize: SIZES.l,
    marginBottom: 2,
    color: COLORS.black,
  },
  shopRating: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
    backgroundColor: COLORS.tertiary,
    borderRadius: 7,
    height: 20,
    width: 40,
  },
  shopDistance: {
    gap: 2,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  shopText: {
    fontSize: SIZES.s,
  },
  shopCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 2,
    gap: 5,
  },
});
