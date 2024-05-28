// Area.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { availableSeatSelector } from '../../store/sellectors';
import AreaCard from '../../components/Profile/AreaCard';
import { COLORS, RESERVATIONS, SIZES } from '../../constants';

const Area = ({ onSelectArea, count, selectedArea }) => {

    const areaShopData = useSelector(availableSeatSelector)
    const [selectedItemId, setSelectedItemId] = useState(null);
    useEffect(() => {
        if (selectedArea) {
            setSelectedItemId(selectedArea)
        }
    })
    const handleAreaSelect = (areaId, pricePerHour, order, item) => {
        onSelectArea(areaId, pricePerHour, order, item);
    };

    const renderItem = ({ item }) => (
        <Pressable
            disabled={(item?.availableSeat < count)}
            onPress={() => handleAreaSelect(item.id, item.pricePerHour, item.order, item)}
        >
            <AreaCard
                areaData={item}
                reservation={true}
                count={count}
                onPress={() => handleAreaSelect(item.id, item.pricePerHour, item.order, item)}
                isSelected={selectedItemId === item.id}
            />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'column',
                gap: SIZES.s,
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: SIZES.l, color: COLORS.black }}>{RESERVATIONS.selectArea}</Text>
            </View>
            <FlatList
                data={areaShopData}
                renderItem={renderItem}
                keyExtractor={(item) => item.order.toString()}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.m,
    },
    flatListContent: {
        paddingTop: SIZES.m,
    },
});

export default Area;
