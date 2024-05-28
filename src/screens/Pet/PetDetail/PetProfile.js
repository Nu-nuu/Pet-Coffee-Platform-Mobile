import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BRS, BUTTONS, COLORS, ICONS, PETS, SIZES, TEXTS } from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { petCoffeeShopDetailSelector, petDetailSelector, userDataSelector } from '../../../store/sellectors';
import { deletePetThunk, getPetDetailThunk, getPetsFromShopThunk } from '../../../store/apiThunk/petThunk';
import { useNavigation } from '@react-navigation/native';
import { NativeBaseProvider, Skeleton } from 'native-base';
import ErrorModal from '../../../components/Alert/errorModal';
import Loading from '../../../components/Alert/modalSimple/loading';
import Success from '../../../components/Alert/modalSimple/success';

const PetProfile = ({ petDatas, petId }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const [petData, setPetData] = useState(petDatas)
    const maxRate = [1, 2, 3, 4, 5];
    const backgroundsArray = petData?.backgrounds != null && petData?.backgrounds.split(';');
    const arrBackground = petData?.backgrounds ? backgroundsArray : [];
    const shopData = useSelector(petCoffeeShopDetailSelector)
    const petDetail = useSelector(petDetailSelector)
    const [showRender, setShowRender] = useState(false)

    const userData = useSelector(userDataSelector)
    const shop = userData.role === 'Staff' ? true : false

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    useEffect(() => {
        setShowRender(true)
        dispatch(getPetDetailThunk(petId))
            .unwrap()
            .then((res) => {
                setPetData(res)
                setShowRender(false)
            })
            .catch((err) => console.log(err))
    }, [petDatas])


    const handleEditPet = (petId) => {
        navigation.navigate('EditPet', {
            shopId: shopData.id,
            petId: petId
        });
    }
    const handleDeletePet = petId => {
        setShowLoadingModal(true);
        dispatch(deletePetThunk(petId))
            .unwrap()
            .then(() => {
                dispatch(getPetsFromShopThunk(shopData.id))
                    .then(() => {
                        setShowLoadingModal(false);
                        setShowSuccessModal(true);
                        setTimeout(() => {
                            setShowSuccessModal(false)
                            navigation.goBack()
                        }, 3000);
                    });
            })
            .catch(error => {
                setShowLoadingModal(false);
                setErrorMsg(error.message);
                setShowErrorModal(true);
            });
    };


    return (
        <NativeBaseProvider>
            <ErrorModal
                showErrorModal={showErrorModal}
                setShowErrorModal={setShowErrorModal}
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
            />
            {showLoadingModal && (
                <Loading isModal={true} />
            )}
            {showSuccessModal && (
                <Success isModal={true} />
            )}
            <View style={{
                backgroundColor: COLORS.bgr,
                padding: SIZES.m,
                minHeight: SIZES.height / 2,
            }}>
                <View>
                    {shop ? (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin về {petData?.name}</Text>
                            <View style={{ flexDirection: 'row', gap: SIZES.s }}>
                                <Pressable
                                    onPress={() => handleDeletePet(petData?.id)}
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
                                    }]}>Xóa</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleEditPet(petData?.id)}
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
                                    }]}>Sửa</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thông tin về {petData?.name}</Text>
                    )}
                    <View style={{ paddingTop: SIZES.s }}>
                        <Text style={TEXTS.content}>{petData?.description}</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            {/* ====================Năm sinh====================== */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                                paddingVertical: SIZES.s / 1.5,
                            }}>
                                <View style={ICONS.coverD}>
                                    <Ionicons name="time" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                                </View>

                                <View style={{
                                    flexDirection: 'column',
                                }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Năm sinh</Text>
                                    <Text style={TEXTS.content}>{petData?.birthYear}</Text>
                                </View>

                            </View>
                            {/* ====================Giới tính====================== */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                                paddingVertical: SIZES.s / 1.5,
                            }}>
                                <View style={{}}>
                                    <View style={{
                                        borderRadius: 18,
                                        width: 36,
                                        height: 36,
                                        backgroundColor: petData?.gender === 'MALE' ? COLORS.male200 : COLORS.female200,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Ionicons
                                            name={petData?.gender === 'MALE' ? 'male' : 'female'}
                                            size={ICONS.m}
                                            color={petData?.gender === 'MALE' ? COLORS.male : COLORS.female}
                                        />
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: 'column',
                                }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Giới tính</Text>
                                    <Text style={[TEXTS.content]}>
                                        {petData?.gender === 'MALE'
                                            ? 'Đực'
                                            : petData?.gender === 'FEMALE'
                                                ? 'Cái'
                                                : 'Không có'}
                                    </Text>
                                </View>

                            </View>
                            {/* ====================Triệt sản====================== */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                                paddingVertical: SIZES.s / 1.5,
                            }}>
                                <View style={ICONS.coverD}>
                                    <Ionicons name="cut" size={ICONS.m} color={COLORS.primary} style={{ padding: 3, }} />
                                </View>

                                <View style={{
                                    flexDirection: 'column',
                                }}>
                                    <Text style={[TEXTS.content, { color: COLORS.black }]}>Triệt sản</Text>
                                    <Text style={TEXTS.content}>
                                        {petData?.spayed == false
                                            ? 'Không'
                                            : petData?.spayed == true
                                                ? 'Có'
                                                : 'Không biết'}
                                    </Text>
                                </View>

                            </View>
                        </View>
                        {/* ====================Thông tin đánh giá, khu vực, cân nặng, giống loài====================== */}
                        <View style={styles.information}>
                            <Text style={[TEXTS.content, { color: COLORS.black }]}>Đánh giá</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: SIZES.s / 2,
                            }}>
                                {maxRate.map(item => {
                                    return (
                                        <View activeOpacity={0.7} key={item}                                         >
                                            <AntDesign
                                                name={item <= petData?.rate ? 'star' : 'staro'}
                                                color={COLORS.yellow}
                                                size={SIZES.xm}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={styles.information}>
                            <Text style={[TEXTS.content, { color: COLORS.black }]}>Khu vực</Text>
                            {showRender ? (
                                <View style={{ width: "10%" }}>
                                    <Skeleton.Text lines={1} />
                                </View>
                            ) : (
                                <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>
                                    {petData?.area?.length > 0 ? (
                                        `Tầng ${petData.area.map(item => item.order).join(',')}`
                                    ) : (
                                        'Chưa có'
                                    )}
                                </Text>
                            )}

                        </View>
                        <View style={styles.information}>
                            <Text style={[TEXTS.content, { color: COLORS.black }]}>Cân nặng</Text>
                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{petData?.weight} kg</Text>
                        </View>
                        <View style={styles.information}>
                            <Text style={[TEXTS.content, { color: COLORS.black }]}>Giống loài</Text>
                            <Text style={[TEXTS.content, { color: COLORS.black, fontWeight: '500' }]}>{petData?.typeSpecies}</Text>
                        </View>
                        {/* ====================Thư viện ảnh====================== */}
                        <View style={{ paddingTop: SIZES.s }}>
                            <Text style={{ fontWeight: 'bold', fontSize: SIZES.m, color: COLORS.black }}>Thư viện ảnh của {petData?.name}</Text>
                            {arrBackground?.length > 0 ? (
                                <FlatList
                                    data={arrBackground}
                                    renderItem={({ item }) => (
                                        <View style={{ padding: SIZES.s }}>
                                            <Image
                                                source={{ uri: item }}
                                                alt=""
                                                style={{
                                                    width: SIZES.width / 3 - SIZES.s * 2,
                                                    objectFit: 'cover',
                                                    height: SIZES.height / 4,
                                                    position: 'relative',
                                                    borderRadius: BRS.in
                                                }}
                                            />
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal
                                />
                            ) : (
                                <View style={{
                                    alignItems: 'center', justifyContent: 'center',
                                    padding: SIZES.m
                                }}>
                                    <Text style={TEXTS.content} >{PETS.noImage}</Text>
                                    <Image alt='noInformation' source={require('../../../../assets/noinfor.png')} style={{
                                        height: SIZES.height / 6,
                                        width: SIZES.height / 6,
                                        alignSelf: 'center',
                                    }} />
                                </View>
                            )}

                        </View>
                    </View>

                </View>
            </View>
        </NativeBaseProvider>
    )
}

export default PetProfile

const styles = StyleSheet.create({
    information: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SIZES.s,
        borderBottomWidth: 1,
        borderColor: COLORS.gray1,
    }
})