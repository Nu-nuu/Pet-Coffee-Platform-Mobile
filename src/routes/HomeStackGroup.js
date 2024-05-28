//navigate

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import Map from '../screens/Map/map';
import TabGroup from './TabGroup';
import Items from '../screens/Items/items';
import PostDetail from '../screens/Social/postDetail';
import CreatePost from '../screens/Social/createPost';
import ShopDetail from '../screens/PetCoffeeShop/ShopDetail/ShopDetail';
import EditProfile from '../screens/Authorize/EditProfile/EditProfile';
import ChangePassword from '../screens/Authorize/changePassword/changePassword';
import PetDetail from '../screens/Pet/PetDetail/PetDetail';
import CommentDetail from '../components/Social/comments/commentDetail';
import Report from '../components/Social/reports/report';
import EditShopProfile from '../screens/PetCoffeeShop/EditShopProfile/EditShopProfile';
// import CreatePet from '../screens/Pet/CreatePet/CreatePet';
import EditPet from '../screens/Pet/EditPet/EditPet';
import CreateVaccination from '../screens/Pet/Vaccination/CreateVaccination/CreateVaccination';
import EditVaccination from '../screens/Pet/Vaccination/EditVaccination/EditVaccination';
import CreateMoment from '../screens/Pet/Moment/CreateMoment/CreateMoment';
import EditMoment from '../screens/Pet/Moment/EditMoment/EditMoment';
import CreateArea from '../screens/PetCoffeeShop/Area/CreateArea/CreateArea';
import EditArea from '../screens/PetCoffeeShop/Area/EditArea/EditArea';

import TransactionHistory from '../screens/TransactionHistory/transactionHistory';
import Reservation from '../screens/Reservation/reservation';
import Topup from '../screens/Topup/topup';

import EventDetail from '../screens/PetCoffeeShop/Event/EventDetail/eventDetail';
import MomentDetail from '../screens/Pet/Moment/MomentDetail/MomentDetail';
import JoinEvent from '../screens/PetCoffeeShop/Event/JoinEvent/joinEvent';
import AreaDetail from '../screens/PetCoffeeShop/Area/AreaDetail/AreaDetail';
import ChangePetArea from '../screens/PetCoffeeShop/Area/ChangePetArea/ChangePetArea';
import ReservationDetail from '../screens/Reservation/reservationDetail';
import ReservationHistory from '../screens/Reservation/reservationHistory';
import TransactionDetail from '../screens/TransactionHistory/transactionDetail';
import CafeList from '../screens/PetCoffeeShop/ShopList/CafeList';
import CreatePet from '../screens/Pet/CreatePet/CreatePet';
import SearchPage from '../screens/Search/searchPage';

const HomeStack = createNativeStackNavigator();

export default function HomeStackGroup() {


  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="TabGroup"
        component={TabGroup}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Map"
        component={Map}
        options={{ headerTitle: "Bản đồ" }}

      />
      <HomeStack.Screen
        name="CafeList"
        component={CafeList}
      // options={{ headerShown: false }}
      />

      <HomeStack.Screen
        name="ShopDetail"
        component={ShopDetail}
      />

      <HomeStack.Screen
        name="PetDetail"
        component={PetDetail}
      // options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="EditProfile"
        component={EditProfile}
      />
      <HomeStack.Screen
        name="EditShopProfile"
        component={EditShopProfile}

      />
      <HomeStack.Screen
        name="ChangePassword"
        component={ChangePassword}
      />


      <HomeStack.Screen
        name="CreatePet"
        component={CreatePet}
      />



      <HomeStack.Screen
        name="EditPet"
        component={EditPet}
      />
      <HomeStack.Screen
        name="CreateVaccination"
        component={CreateVaccination}
        options={{ title: 'Thêm thông tin tiêm phòng' }}
      />
      <HomeStack.Screen
        name="EditVaccination"
        component={EditVaccination}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="CreateMoment"
        component={CreateMoment}
        options={{ title: 'Thêm khoảnh khắc thú cưng' }}

      />
      <HomeStack.Screen
        name="EditMoment"
        component={EditMoment}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="MomentDetail"
        component={MomentDetail}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="CreateArea"
        component={CreateArea}
      />
      <HomeStack.Screen
        name="EditArea"
        component={EditArea}
      />
      <HomeStack.Screen
        name="ChangePetArea"
        component={ChangePetArea}
      />
      <HomeStack.Screen
        name="AreaDetail"
        component={AreaDetail}
      />
      <HomeStack.Screen
        name="EventDetail"
        component={EventDetail}
      />
      <HomeStack.Screen
        name="JoinEvent"
        component={JoinEvent}
      // options={{ headerShown: false }}
      />

      <HomeStack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          headerTitle: 'Tạo bài viết',
        }}
      />
      <HomeStack.Screen name="PostDetail" component={PostDetail} options={{ title: "Chi tiết bài viết" }} />
      <HomeStack.Screen name="CommentDetail" component={CommentDetail} options={{ title: "Chi tiết bình luận" }} />
      <HomeStack.Screen name="Report" component={Report} options={{ title: "Báo cáo" }} />
      <HomeStack.Screen name="Reservation" component={Reservation} />
      <HomeStack.Screen name="ReservationDetail" component={ReservationDetail} options={{ title: "Chi tiết đặt chỗ" }} />

      <HomeStack.Screen name="Topup" component={Topup} options={{ title: "Nạp tiền" }} />
      <HomeStack.Screen name="Items" component={Items} options={{ title: "Cửa hàng quà tặng" }} />
      <HomeStack.Screen name="TransactionHistory" component={TransactionHistory} options={{ title: "Lịch sử giao dịch" }} />
      <HomeStack.Screen name="ReservationHistory" component={ReservationHistory} options={{ title: "Lịch sử đặt chỗ" }} />
      <HomeStack.Screen name="TransactionDetail" component={TransactionDetail} options={{ title: "Chi tiết giao dịch" }} />

      <HomeStack.Screen name="SearchPage" component={SearchPage} />


    </HomeStack.Navigator>
  );
}
