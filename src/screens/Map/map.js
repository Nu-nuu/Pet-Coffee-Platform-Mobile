// Map.js
import Mapbox from '@rnmapbox/maps';
import { PointAnnotation, MapView, Camera, ShapeSource, LineLayer } from '@rnmapbox/maps';

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Image, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MAP_API from '../../utils/keyMap';
import { useDispatch, useSelector } from 'react-redux';
import { allPetCoffeeShopsSelector } from '../../store/sellectors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BRS, BUTTONS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Loading from '../../components/Alert/modalSimple/loading';
import { addShop } from '../../store/features/petCoffeeShop.slice/allPetCoffeeShops.slice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

Mapbox.setAccessToken("pk.eyJ1IjoibnV1LTIzOCIsImEiOiJjbHJnNmQ2eXUwY3drMnJybTg2MHVnM3F4In0.rjXxSbSRp7LI-Oy1mJzF1g");


const Map = ({ route, navigation }) => {

  const { followedShopIds, shopData, userLatitude, userLongitude, selectedShopId } = route.params

  const [mapLocation, setMapLocation] = useState(null);

  const shopList = useSelector(allPetCoffeeShopsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (shopList && shopData) {
      const shopExists = shopList.some(shop => shop.id === shopData.id);
      if (!shopExists) {
        dispatch(addShop(shopData));
      }
    }
  }, [shopData, shopList, dispatch]);

  useEffect(() => {
    if (!mapLocation) {
      Geolocation.getCurrentPosition(
        (position) => {
          let longitude = JSON.stringify(position.coords.longitude);
          let latitude = JSON.stringify(position.coords.latitude);
          setMapLocation({ longitude, latitude })
        },
        (error) => console.log(error.message),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        }
      );
    }
  }, [mapLocation]);

  const [selectedShop, setSelectedShop] = useState(null);
  const [routeDirections, setRouteDirections] = useState(null);
  const [directionSteps, setDirectionSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const flatListRef = useRef(null);

  const handleCardPress = (id) => {
    setSelectedShop(id);
    setRouteDirections(null);

    const index = shopList.findIndex((item) => item.id === id);
    flatListRef.current.scrollToIndex({ index: index, animated: true });

  };


  const fetchDirectionFromShop = async () => {

    const startCoords = `${userLongitude},${userLatitude}`;
    const endCoords = `${shopData.longitude},${shopData.latitude}`;
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&language=vi&access_token=${MAP_API}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const coordinates = data.routes[0].geometry.coordinates;
      const steps = data.routes[0].legs[0].steps;

      const routeDirections = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates,
            },
          },
        ],
      };
      setRouteDirections(routeDirections);
      setDirectionSteps(steps);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }
  const fetchUserLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);
        setMapLocation({ latitude, longitude })
      },
      (error) => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  }

  useEffect(() => {
    if (shopData) {
      setLoading(true)
      fetchUserLocation()
        .then(() => {
          fetchDirectionFromShop()
          setSelectedShop(shopData.id)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err);
        })
    };
  }, [])


  const renderCafeItem = ({ item }) => {
    const checkFollow = followedShopIds?.includes(item.id);

    const fetchDirections = async () => {
      const startCoords = `${mapLocation.longitude},${mapLocation.latitude}`;
      const endCoords = `${item.longitude},${item.latitude}`;
      const geometries = 'geojson';

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&language=vi&access_token=${MAP_API}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const coordinates = data.routes[0].geometry.coordinates;
        const steps = data.routes[0].legs[0].steps;

        const routeDirections = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
            },
          ],
        };

        setRouteDirections(routeDirections);
        setDirectionSteps(steps);
      } catch (error) {
        console.error('Error fetching directions:', error);
      }
    };

    const handleDirectionsPress = async (id) => {
      setSelectedShop(id)
      await fetchDirections();
    };

    const handleUnDirectionsPress = () => {
      setRouteDirections(null);
    };
    return (
      <Pressable
        onPress={() => navigation.navigate('ShopDetail', { id: item.id, shopData: item, checkFollow })}
        style={{
          // marginRight: SIZES.s,
        }} >
        <View style={[styles.shopContainer, SHADOWS.s, selectedShop === item.id ? { borderColor: COLORS.primary, borderWidth: 1 } : null]}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.shopImageContainer}>
              <Image
                source={{
                  uri: item.avatarUrl,
                }}
                style={styles.shopImage}
              />
            </View>
          </View>
          <View style={{ alignItems: 'flex-start', marginLeft: SIZES.m, alignSelf: 'flex-start', paddingTop: 10 }}>
            <View style={styles.shopDetail}>
              <Text numberOfLines={1} style={TEXTS.heading}>{item.name}</Text>
              <View style={styles.shopHeader}>
                <Ionicons name="navigate-circle" size={15} color={COLORS.primary} />
                <Text style={TEXTS.subContent}>{item?.distance?.toFixed(2)} Km</Text>
              </View>
              <View style={styles.shopHeader}>
                <Ionicons name="call" size={15} color={COLORS.primary} />
                <Text style={[TEXTS.subContent]}>{item.phone}</Text>
              </View>
              <View style={styles.shopHeader}>
                <Ionicons name="mail" size={15} color={COLORS.primary} />
                <Text style={TEXTS.subContent}>{item.email}</Text>
              </View>
              {selectedShop === item.id && routeDirections ? (
                <View style={{ alignSelf: 'flex-end', paddingRight: SIZES.s }}>
                  <Pressable
                    onPress={handleUnDirectionsPress}
                    style={[
                      BUTTONS.recMid,
                      {
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }]}>
                    <Text style={[{
                      fontWeight: '500',
                      color: COLORS.white,
                      fontSize: SIZES.m
                    }]}>
                      Kết thúc
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ alignSelf: 'flex-end', paddingRight: SIZES.s }}>
                  <Pressable
                    onPress={() => handleDirectionsPress(item.id)}
                    style={[
                      BUTTONS.recMid,
                      {
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }]}>
                    <Text style={[{
                      fontWeight: '500',
                      color: COLORS.white,
                      fontSize: SIZES.m
                    }]}>
                      Chỉ đường
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
          {item.hasPromotion && (
            <View style={[ICONS.coverPro, {
              position: 'absolute',
              top: "2%",
              right: "2%",
            }]}>
              <MaterialIcons
                name="redeem"
                size={ICONS.xm}
                color={COLORS.primary}
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  }
  return (
    <View style={styles.container}>
      {mapLocation ? (
        <Mapbox.MapView
          compassEnabled
          style={{ width: "100%", height: "95%" }}
          zoomEnabled
          rotateEnabled
          // styleURL="mapbox://styles/vietnguyen123/clu58ub8l004r01pq9c17a8ro"
          styleURL='mapbox://styles/nuu-238/clv390h1300dm01qr0i8a1com'
        >
          <Mapbox.Camera
            zoomLevel={10}
            animationMode='flyTo'
            animationDuration={6000}
            centerCoordinate={[106.809421, 10.841533]}
          />

          <Mapbox.PointAnnotation
            id="marker"
            coordinate={[mapLocation.longitude, mapLocation.latitude]}>
            <View style={[styles.marker, styles.defaultMarker]} />
          </Mapbox.PointAnnotation>
          {shopList.map(item => (
            <Mapbox.PointAnnotation
              key={item.id.toString()}
              id={`item${item.id}`}
              coordinate={[item.longitude, item.latitude]}
              onSelected={() => handleCardPress(item.id)}>
              <View style={[{
                padding: SIZES.s / 2,
                borderRadius: BRS.in,
                backgroundColor: COLORS.primary,
              }]}>
                <Text style={[TEXTS.content, { color: COLORS.white }]}>{item.name}</Text>
              </View>
            </Mapbox.PointAnnotation>
          ))}
          {routeDirections && (
            <Mapbox.ShapeSource id="routeSource" shape={routeDirections}>
              <Mapbox.LineLayer
                id="routeLayer"
                style={{
                  lineColor: '#3b3bff',
                  lineWidth: 10,
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>
      ) : (
        <View style={{ flex: 1, backgroundColor: COLORS.bgr }}>
          <Loading />
        </View>
      )}
      {routeDirections && (
        <TouchableOpacity
          onPress={() => setShowManual(!showManual)}
          style={{
            position: 'absolute',
            left: "1%",
            top: '4%',
            backgroundColor: COLORS.white,
            padding: SIZES.m,
            borderRadius: BRS.in,
            flexDirection: 'row',
            alignItems: 'center',
            gap: SIZES.s / 2,
          }}>
          <Ionicons name='list' size={ICONS.xm} color={COLORS.black} />
          <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>
            {showManual ? 'Đóng hướng dẫn' : 'Xem hướng dẫn'}
          </Text>
        </TouchableOpacity>
      )}
      {showManual && routeDirections && (
        <FlatList
          data={directionSteps}
          style={{
            position: 'absolute',
            left: "1%",
            top: '12%',
            width: SIZES.width / 2,
            height: SIZES.height / 2,
            backgroundColor: COLORS.white700,
            borderRadius: BRS.in,
          }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `step-${index}`}
          renderItem={({ item }) => (
            <View style={styles.stepContainer}>
              <Text style={styles.stepInstruction}>{item.maneuver.instruction}</Text>
              <Text style={styles.stepDuration}>{(item.duration / 60).toFixed(2)}p ({item.distance.toFixed(2)} m)</Text>
            </View>
          )}
        />
      )}

      {loading ? (
        <Loading isModal={false} />
      ) :
        (
          <>
            <FlatList
              ref={flatListRef}
              data={shopList}
              renderItem={renderCafeItem}
              style={styles.flatList}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </>
        )}
    </View>

  );
};

const markerSize = 20;

const styles = StyleSheet.create({
  stepContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
  stepInstruction: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepDistance: {
    fontSize: 14,
    color: '#666',
  },
  stepDuration: {
    fontSize: 14,
    color: '#666',
  },

  defaultLocationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
  },

  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: markerSize,
    height: markerSize,
    borderRadius: markerSize / 2,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  defaultMarker: {
    backgroundColor: 'blue',
  },
  shopImageContainer: {
    width: 130,
    height: 130,
    borderRadius: BRS.in,
    overflow: 'hidden',
  },
  shopImage: {
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  shopDetail: {
    width: SIZES.width / 2.2,
    flexDirection: 'column',
    gap: SIZES.s / 4,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,

  },
  flatList: {
    position: 'absolute',
    bottom: SIZES.m,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.m,
    marginRight: SIZES.s,
  },
  shopContainer: {
    backgroundColor: COLORS.white,
    width: SIZES.width - SIZES.m * 3,
    height: SIZES.height / 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    marginRight: SIZES.m,
    position: 'relative'
  },
});

export default Map;
