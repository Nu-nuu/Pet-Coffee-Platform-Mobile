// AreaCard.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import Coin from '../Wallet/coin';

const AreaCard = ({ order, totalSeat, pricePerHour, availableSeat, image, description, pets, onPress }) => {
    const textColor = totalSeat - availableSeat === totalSeat ? COLORS.error : COLORS.success;
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    return (
        <>
            <TouchableOpacity style={[styles.card, showMore && styles.cardFull]} onPress={toggleShowMore}>
                <Image source={{ uri: image }} style={[styles.image, showMore && styles.imageFull]} />
                <View style={[styles.column, showMore && styles.columnFull]}>
                    <View style={[styles.topSection, showMore && styles.topSectionFull]}>
                        <Text style={styles.boldText}>Tầng: {order}</Text>
                        <Text >Còn trống: {availableSeat}</Text>
                    </View>
                    {showMore && (
                        <View style={{ paddingVertical: SIZES.s }}>
                            <Text>Thông tin chi tiết: </Text>
                            <Text style={{ paddingLeft: SIZES.s }}>{description}</Text>
                        </View>
                    )}
                    {showMore ? (
                        <>
                            <View style={styles.middleSection}>
                                <Text>Thú cưng đang hoạt động:</Text>
                                {pets?.map((pet, index) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SIZES.m }}>
                                        <Image key={index} source={{ uri: pet.avatar }} style={styles.petAvatarFull} />
                                        <Text>{pet.name}</Text>
                                        <Text>Loài: {pet.petType}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.bottomSection}>
                                <Coin coin={pricePerHour} size='mid' />
                                <TouchableOpacity
                                    style={[styles.selectButtonFull, (totalSeat - availableSeat) === totalSeat && { backgroundColor: COLORS.gray2 }]}
                                    disabled={(totalSeat - availableSeat) === totalSeat}
                                    onPress={onPress}
                                >
                                    <Text>Chọn</Text>
                                </TouchableOpacity>
                            </View>

                        </>

                    ) :
                        (
                            <>
                                <View style={[styles.middleSection, { paddingVertical: SIZES.s }]}>
                                    <Text>Thú cưng</Text>
                                    {pets?.length > 4 ? pets?.slice(0, 4).map((pet, index) => (
                                        <Image key={index} source={{ uri: pet.avatar }} style={styles.petAvatar} />
                                    )) : (
                                        <>
                                            {pets?.map((pet, index) => (
                                                <Image key={index} source={{ uri: pet.avatar }} style={styles.petAvatar} />
                                            ))}
                                        </>
                                    )}
                                </View>
                                <View style={styles.bottomSection}>
                                    <Coin coin={pricePerHour} size='min' />
                                    <TouchableOpacity
                                        style={[styles.selectButton, (totalSeat - availableSeat) === totalSeat && { backgroundColor: COLORS.gray2 }]}
                                        disabled={(totalSeat - availableSeat) === totalSeat}
                                        onPress={onPress}
                                    >
                                        <Text>Chọn</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                </View>
                <View style={styles.topRight}>
                    <Text style={[styles.topText, { color: textColor }]}>{totalSeat - availableSeat} / {totalSeat}</Text>
                </View>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 400,
        height: 200,
        backgroundColor: COLORS.quaternary,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.tertiary,
        marginTop: SIZES.xl
    },
    cardFull: {
        width: 400,
        height: 'auto',
        flexDirection: 'column',
    },

    column: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 2,
        marginLeft: 20,
        flex: 1,
        alignItems: 'flex-start',
    },
    columnFull: {

    },
    topSection: {
        flex: 1,
        padding: SIZES.s / 4,
    },

    topSectionFull: {
        flex: 0,
        paddingTop: 0,
        flexDirection: 'row',
        gap: SIZES.xl,
        alignItems: 'flex-end'
    },
    middleSection: {
        flex: 1,
    },
    bottomSection: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.s
    },


    topRight: {
        position: 'absolute',
        top: -20,
        right: 0,
        backgroundColor: COLORS.quaternary,
        borderRadius: SIZES.s,
        padding: SIZES.s / 2,
        borderWidth: 1,
        borderColor: COLORS.primary
    },
    topText: {
        fontSize: 18,
        fontWeight: 'bold',

    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 24,
    },

    image: {
        width: 220,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 10,
    },

    imageFull: {
        width: 380,
        height: 150,
    },

    petAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        margin: 5,
    },
    petAvatarFull: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5,

    },

    selectButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        padding: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectButtonFull: {
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        padding: 10,
        paddingHorizontal: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    }
});

export default AreaCard;
