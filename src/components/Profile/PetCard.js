import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AVATARS, BRS, COLORS, ICONS, SHADOWS, SIZES, TEXTS } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PetCard = ({ petData, area }) => {
    return (
        <View style={{
            marginBottom: SIZES.s
        }}>
            <View style={[{
                backgroundColor: COLORS.white,
                width: '100%',
                height: 78,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 18,
                paddingHorizontal: 14,
                paddingVertical: 12,
                justifyContent: 'space-between',
            }, SHADOWS.s]}>
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                }}>
                    {petData.avatar ? (<Image source={{ uri: petData.avatar }} style={AVATARS.mid} />)
                        : (<View style={AVATARS.mid}></View>)}
                    <View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2, }}>
                            <Text numberOfLines={1} style={[TEXTS.content, { color: COLORS.black, fontWeight: 'bold' }]}>{petData.name}</Text>
                            <Text style={[TEXTS.content]}>{petData.typeSpecies}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: '40%', marginLeft: 10, justifyContent: 'space-between' }}>
                    {!area ? (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                        }}>
                            <View style={{
                                backgroundColor: petData.petStatus === 'Active'
                                    ? COLORS.success : petData.petStatus === 'Inactive'
                                        ? COLORS.gray2 : COLORS.yellow,
                                height: 6,
                                width: 6,
                                borderRadius: 3,
                            }}>
                            </View>
                            <Text style={[TEXTS.subContent, {
                                color: petData.petStatus === 'Active'
                                    ? COLORS.success : petData.petStatus === 'Inactive'
                                        ? COLORS.gray2 : COLORS.yellow,
                            }]}>
                                {petData.petStatus === 'Active'
                                    ? 'Hoạt động' : petData.petStatus === 'Inactive'
                                        ? 'Tưởng nhớ' : 'Chữa trị'}

                            </Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }, area && styles.Area]}>
                                {petData.area.length > 0 ? (
                                    'Tầng ' + `${petData.area[0].order}`
                                ) : (
                                    'Chưa có'
                                )}
                            </Text>
                        </View>
                    )
                    }
                    {!area && (
                        <View style={{
                            borderRadius: 20,
                            width: 40,
                            height: 40,
                            backgroundColor: petData.gender === 'MALE' ? COLORS.male200 : COLORS.female200,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Ionicons
                                name={petData.gender === 'MALE' ? 'male' : 'female'}
                                size={ICONS.m}
                                color={petData.gender === 'MALE' ? COLORS.male : COLORS.female}
                            />
                        </View>
                    )}
                </View>
            </View>

        </View>
    )
}

export default PetCard

const styles = StyleSheet.create({

})