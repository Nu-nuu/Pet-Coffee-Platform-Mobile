import { Skeleton } from 'native-base';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import {
  petCoffeeShopDetailSelector,
  userDataSelector,
} from '../../store/sellectors';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { COLORS, ICONS, SIZES, TEXTS } from '../../constants';
import Coin from '../Wallet/coin';
import formatDayReservation from './../Reservation/formatDayReservation';
import checkActivityShop from './checkActivityShop';

export default function AboutComponent(props) {
  const petCoffeeShopDetail = useSelector(petCoffeeShopDetailSelector);
  const userData = useSelector(userDataSelector);
  const showRender = props.showRender;
  const shopId = props.shopId;

  const [createDay, setCreateDay] = useState(
    petCoffeeShopDetail?.createdAt || new Date(),
  );

  return (
    <View
      style={{
        backgroundColor: COLORS.bgr,
        padding: SIZES.m,
        minHeight: SIZES.height / 2,
      }}>
      {shopId ? (
        <>
          <View>
            <View
              style={{
                borderBottomWidth: 1,
                paddingBottom: SIZES.m,
                borderColor: COLORS.gray2,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: SIZES.m,
                  color: COLORS.black,
                }}>
                Chi tiết
              </Text>
              {/* Address */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                  width: '95%',
                }}>
                <Ionicons
                  name="location"
                  size={ICONS.xm}
                  color={COLORS.primary}
                />
                {showRender ? (
                  <Skeleton.Text lines={2} />
                ) : (
                  <Text style={TEXTS.content}>
                    {petCoffeeShopDetail?.location}
                  </Text>
                )}
              </View>
              {/* Phone */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <Ionicons name="call" size={ICONS.xm} color={COLORS.primary} />
                {showRender ? (
                  <Skeleton.Text lines={1} />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`tel:${petCoffeeShopDetail?.phone}`)
                    }>
                    <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                      {petCoffeeShopDetail?.phone}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Mail */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <Ionicons name="mail" size={ICONS.xm} color={COLORS.primary} />
                {showRender ? (
                  <Skeleton.Text lines={1} />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`mailto:${petCoffeeShopDetail?.email}`)
                    }>
                    <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                      {petCoffeeShopDetail?.email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Giờ mở cửa */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <Ionicons name="time" size={ICONS.xm} color={COLORS.primary} />
                {showRender ? (
                  <Skeleton.Text lines={1} />
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 5,
                      alignItems: 'center',
                    }}>
                    <Text style={[TEXTS.content]}>
                      {checkActivityShop(
                        petCoffeeShopDetail?.startTime,
                        petCoffeeShopDetail?.endTime,
                      )}
                    </Text>
                    {!petCoffeeShopDetail?.startTime &&
                      !petCoffeeShopDetail?.endTime ? null : (
                      <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                        {' '}
                        {petCoffeeShopDetail?.startTime} -{' '}
                        {petCoffeeShopDetail?.endTime}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              {/* Mức giá */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <Ionicons name="cash" size={ICONS.xm} color={COLORS.primary} />
                {showRender ? (
                  <Skeleton.Text lines={1} />
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 2,
                    }}>
                    <Text style={TEXTS.content}>Mức giá </Text>
                    <Coin coin={petCoffeeShopDetail?.minPriceArea} size="min" />
                    <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                      {' '}
                      -{' '}
                    </Text>
                    <Coin coin={petCoffeeShopDetail?.maxPriceArea} size="min" />
                  </View>
                )}
              </View>
              {/* Đánh giá */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <Ionicons name="star" size={ICONS.xm} color={COLORS.primary} />
                {showRender ? (
                  <Skeleton.Text lines={1} />
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 2,
                    }}>
                    <Text style={TEXTS.content}>Đánh giá </Text>
                    <Text
                      style={[
                        TEXTS.content,
                        {
                          fontWeight:
                            petCoffeeShopDetail?.rates > 0 ? 'bold' : '400',
                          color: COLORS.primary,
                        },
                      ]}>
                      {petCoffeeShopDetail?.rates > 0
                        ? `${petCoffeeShopDetail?.rates.toFixed(1)}`
                        : 'Chưa có đánh giá'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ paddingTop: SIZES.m }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: SIZES.m,
                  color: COLORS.black,
                }}>
                Thông tin về Quán
              </Text>
              {/* Ngày tạo */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <View style={ICONS.coverD}>
                  <Ionicons
                    name="time"
                    size={ICONS.m}
                    color={COLORS.primary}
                    style={{ padding: 3 }}
                  />
                </View>
                {showRender ? (
                  <Skeleton.Text lines={2} />
                ) : (
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={[TEXTS.content, { color: COLORS.black }]}>
                      Ngày tạo - {petCoffeeShopDetail?.name}
                    </Text>
                    <Text style={TEXTS.content}>
                      {formatDayReservation(createDay)}
                    </Text>
                  </View>
                )}
              </View>
              {/* Người đại diện */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <View style={ICONS.coverD}>
                  <Ionicons
                    name="person"
                    size={ICONS.m}
                    color={COLORS.primary}
                    style={{ padding: 3 }}
                  />
                </View>
                {showRender ? (
                  <Skeleton.Text lines={2} />
                ) : (
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={[TEXTS.content, { color: COLORS.black }]}>
                      Người đại diện
                    </Text>
                    <Text style={TEXTS.content}>
                      {petCoffeeShopDetail?.createdBy?.fullName}
                    </Text>
                  </View>
                )}
              </View>
              {/* Mã số thuế */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingRight: SIZES.m,
                  paddingVertical: SIZES.s / 1.5,
                }}>
                <View style={ICONS.coverD}>
                  <Ionicons
                    name="business"
                    size={ICONS.m}
                    color={COLORS.primary}
                    style={{ padding: 3 }}
                  />
                </View>
                {showRender ? (
                  <Skeleton.Text lines={2} />
                ) : (
                  <View
                    style={{
                      flexDirection: 'column',
                    }}>
                    <Text style={[TEXTS.content, { color: COLORS.black }]}>
                      Mã số thuế
                    </Text>
                    <Text style={TEXTS.content}>
                      {petCoffeeShopDetail?.taxCode}
                    </Text>
                  </View>
                )}
              </View>
              {/* Website */}
              {petCoffeeShopDetail?.websiteUrl && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingRight: SIZES.m,
                    paddingVertical: SIZES.s / 1.5,
                  }}>
                  <View style={ICONS.coverD}>
                    <Ionicons
                      name="globe"
                      size={ICONS.m}
                      color={COLORS.primary}
                      style={{ padding: 3 }}
                    />
                  </View>
                  {showRender ? (
                    <Skeleton.Text lines={2} />
                  ) : (
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <Text style={[TEXTS.content, { color: COLORS.black }]}>
                        Website
                      </Text>
                      <Text style={TEXTS.content}>
                        {petCoffeeShopDetail?.websiteUrl}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {/* Facebook */}
              {petCoffeeShopDetail?.fbUrl && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingRight: SIZES.m,
                    paddingVertical: SIZES.s / 1.5,
                  }}>
                  <View style={ICONS.coverD}>
                    <Ionicons
                      name="logo-facebook"
                      size={ICONS.m}
                      color={COLORS.primary}
                      style={{ padding: 3 }}
                    />
                  </View>
                  {showRender ? (
                    <Skeleton.Text lines={2} />
                  ) : (
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <Text style={[TEXTS.content, { color: COLORS.black }]}>
                        Facebook
                      </Text>
                      <Text style={TEXTS.content}>
                        {petCoffeeShopDetail?.fbUrl}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {/* Instagram */}
              {petCoffeeShopDetail?.instagramUrl && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingRight: SIZES.m,
                    paddingVertical: SIZES.s / 1.5,
                  }}>
                  <View style={ICONS.coverD}>
                    <Ionicons
                      name="logo-instagram"
                      size={ICONS.m}
                      color={COLORS.primary}
                      style={{ padding: 3 }}
                    />
                  </View>
                  {showRender ? (
                    <Skeleton.Text lines={2} />
                  ) : (
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <Text style={[TEXTS.content, { color: COLORS.black }]}>
                        Instagram
                      </Text>
                      <Text style={TEXTS.content}>
                        {petCoffeeShopDetail?.instagramUrl}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
          {/* )} */}
        </>
      ) : (
        <View style={{}}>
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: SIZES.m,
                color: COLORS.black,
              }}>
              Thông tin cá nhân
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingRight: SIZES.m,
                paddingVertical: SIZES.s / 1.5,
                width: '95%',
              }}>
              <Ionicons
                name="location"
                size={ICONS.xm}
                color={COLORS.primary}
              />
              {showRender ? (
                <Skeleton.Text lines={2} />
              ) : (
                <Text style={TEXTS.content}>{userData.address}</Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingRight: SIZES.m,
                paddingVertical: SIZES.s / 1.5,
              }}>
              <Ionicons name="call" size={ICONS.xm} color={COLORS.primary} />
              {showRender ? (
                <Skeleton.Text lines={1} />
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${petCoffeeShopDetail?.phone}`)
                  }>
                  <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                    {userData.phoneNumber}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingRight: SIZES.m,
                paddingVertical: SIZES.s / 1.5,
              }}>
              <Ionicons name="mail" size={ICONS.xm} color={COLORS.primary} />
              {showRender ? (
                <Skeleton.Text lines={1} />
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`mailto:${petCoffeeShopDetail?.email}`)
                  }>
                  <Text style={[TEXTS.content, { color: COLORS.primary }]}>
                    {userData.email}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
