import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'native-base'
import { BRS, COLORS, ICONS, SIZES, TEXTS } from '../../constants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NotConnected = ({ isNotConnected }) => {
    const [isOpen, setIsdOpen] = useState(isNotConnected);

    return (
        <Modal
            isOpen={isOpen}
            style={{ flex: 1 }}>
            <Modal.Content >
                <View style={{ backgroundColor: COLORS.gray1, height: SIZES.height / 18, paddingHorizontal: SIZES.m, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.m, }}>
                        <MaterialIcons
                            name='wifi-off'
                            size={ICONS.m}
                            color={COLORS.primary} />
                        <Text> Mất kết nối Internet</Text>

                    </View>
                    <TouchableOpacity
                        style={{ borderLeftColor: COLORS.gray2, borderLeftWidth: 1, paddingLeft: SIZES.s, }}
                        onPress={() => setIsdOpen(false)}>
                        <Text style={[TEXTS.content, { fontWeight: 'bold' }]}>Đóng</Text>
                    </TouchableOpacity>
                </View>

            </Modal.Content>
        </Modal>
    )
}

export default NotConnected

const styles = StyleSheet.create({})