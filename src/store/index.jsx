import { configureStore } from '@reduxjs/toolkit';

import { userDetailSlice } from './features/user.slice/userDetail.slice';
import { userDataSlice } from './features/user.slice/userData.slice';

import { petDetailSlice } from './features/pet.slice/petDetail.slice';
import { petsFromShopSlice } from './features/pet.slice/petsFromShop.slice';
import { petsFromAreaSlice } from './features/pet.slice/petsFromArea.slice';

import { areasFromShopSlice } from './features/area.slice/areasFromShop.slice';
import { areaDetailSlice } from './features/area.slice/areaDetail.slice';

import { eventDetailSlice } from './features/event.slice/eventDetail.slice';
import { eventsFromShopSlice } from './features/event.slice/eventsFromShop.slice';
import { eventDetailForCustomerSlice } from './features/event.slice/eventDetailForCustomer.slice';
import { joinEventsSlice } from './features/event.slice/joinEvents.slice';

import { momentsFromPetSlice } from './features/moment.slice/momentsFromPet.slice';
import { momentDetailSlice } from './features/moment.slice/momentDetail.slice';

import { commentSlice } from './features/comment.slice/comment.slice';
import { replySlice } from './features/comment.slice/reply.slice';
import { postCategorySlice } from './features/postCategory.slice/postCategory.slice';

import { vaccinationsFromPetSlice } from './features/vaccination.slice/vaccinationsFromPet.slice';
import { vaccinationDetailSlice } from './features/vaccination.slice/vaccinationDetail';

import { petCoffeeShopDetailSlice } from './features/petCoffeeShop.slice/petCoffeeShopDetail.slice';
import { allPetCoffeeShopsSlice } from './features/petCoffeeShop.slice/allPetCoffeeShops.slice';
import { petCoffeeShopsSlice } from './features/petCoffeeShop.slice/petCoffeeShops.slice';
import { petCoffeeShopTaxCodeSlice } from './features/petCoffeeShop.slice/petCoffeeShopTaxCode.slice';
import { popularPetCoffeeShopsSlice } from './features/petCoffeeShop.slice/popularPetCoffeeShops.slice';
import { randomPetCoffeeShopsSlice } from './features/petCoffeeShop.slice/randomPetCoffeeShops.slice';

import { postDetailSlice } from './features/post.slice/postDetail.slice';
import { postSlice } from './features/post.slice/post.slice';
import { postShopSlice } from './features/post.slice/postShop.slice';
import { postTagsShopSlice } from './features/post.slice/postTagsShop.slice';

import { allFollowShopsSlice } from './features/followPetCoffeeShop.slice/allFollowShops.slice';

import { allItemsSlice } from './features/item.slice/allItems.slice';
import { itemDetailSlice } from './features/item.slice/itemDetail.slice';
import { itemsFromUserSlice } from './features/item.slice/itemsFromUser.slice';

import { ratingsFromPetSlice } from './features/ratePet.slice/ratingsFromPet.slice';
import { randomRatingSlice } from './features/ratePet.slice/randomRating.slice';

import { allTransactionSlice } from './features/transaction.slice/allTransaction.slice';
import { transactionDetailSlice } from './features/transaction.slice/transactionDetail.slice';
import { transactionFromUserSlice } from './features/transaction.slice/transactionFromUser.slice';
import { transactionFromShopSlice } from './features/transaction.slice/transactionFromShop.slice';

import { walletSlice } from './features/wallet.slice/wallet.slice';
import { availableSeatSlice } from './features/reservation.slice/availableSeat.slice';
import { reservationSlice } from './features/reservation.slice/reservation.slice';
import { reservationDetailSlice } from './features/reservation.slice/reservationDetail.slice';
import { reservationShopSlice } from './features/reservation.slice/reservationShop.slice';

import { productFromShopSlice } from './features/product.slice/productFromShop.slice';
import { productDetailSlice } from './features/product.slice/productDetail.slice';

import { promotionFromShopSlice } from './features/promotion.slice/promotionFromShop.slice';
import { promotionDetailSlice } from './features/promotion.slice/promotionDetail.slice';

import { postAccountSlice } from './features/post.slice/postAccount.slice';
import { nearbyPetCoffeeShopsSlice } from './features/petCoffeeShop.slice/nearbyPetCoffeeShops.slice';
import { searchPetCoffeeShopsSlice } from './features/petCoffeeShop.slice/searchPetCoffeeShops.slice';

import { allNotificationsSlice } from './features/notification.slice/allNotifications.slice';
import { unreadNotificationsSlice } from './features/notification.slice/unreadNotifications.slice';

export const store = configureStore({
  reducer: {
    userDetail: userDetailSlice.reducer,
    userData: userDataSlice.reducer,

    petDetail: petDetailSlice.reducer,
    petsFromShop: petsFromShopSlice.reducer,
    petsFromArea: petsFromAreaSlice.reducer,

    petCoffeeShopDetail: petCoffeeShopDetailSlice.reducer,
    allPetCoffeeShops: allPetCoffeeShopsSlice.reducer,
    petCoffeeShops: petCoffeeShopsSlice.reducer,
    searchPetCoffeeShops: searchPetCoffeeShopsSlice.reducer,

    petCoffeeShopTaxCode: petCoffeeShopTaxCodeSlice.reducer,
    popularPetCoffeeShops: popularPetCoffeeShopsSlice.reducer,
    randomPetCoffeeShops: randomPetCoffeeShopsSlice.reducer,
    nearbyPetCoffeeShops: nearbyPetCoffeeShopsSlice.reducer,

    allNotifications: allNotificationsSlice.reducer,
    unreadNotifications: unreadNotificationsSlice.reducer,

    allFollowShops: allFollowShopsSlice.reducer,

    reply: replySlice.reducer,
    comment: commentSlice.reducer,

    postCategory: postCategorySlice.reducer,

    areasFromShop: areasFromShopSlice.reducer,
    areaDetail: areaDetailSlice.reducer,

    eventDetail: eventDetailSlice.reducer,
    eventsFromShop: eventsFromShopSlice.reducer,
    eventDetailForCustomer: eventDetailForCustomerSlice.reducer,
    joinEvents: joinEventsSlice.reducer,

    momentsFromPet: momentsFromPetSlice.reducer,
    momentDetail: momentDetailSlice.reducer,

    vaccinationsFromPet: vaccinationsFromPetSlice.reducer,
    vaccinationDetail: vaccinationDetailSlice.reducer,

    postDetail: postDetailSlice.reducer,
    post: postSlice.reducer,
    postShop: postShopSlice.reducer,
    postTagsShop: postTagsShopSlice.reducer,
    postAccount: postAccountSlice.reducer,

    allItems: allItemsSlice.reducer,
    itemDetail: itemDetailSlice.reducer,
    itemsFromUser: itemsFromUserSlice.reducer,

    ratingsFromPet: ratingsFromPetSlice.reducer,
    randomRating: randomRatingSlice.reducer,

    allTransaction: allTransactionSlice.reducer,
    transactionDetail: transactionDetailSlice.reducer,
    transactionFromUser: transactionFromUserSlice.reducer,
    transactionFromShop: transactionFromShopSlice.reducer,

    wallet: walletSlice.reducer,

    availableSeat: availableSeatSlice.reducer,
    reservation: reservationSlice.reducer,
    reservationDetail: reservationDetailSlice.reducer,
    reservationShop: reservationShopSlice.reducer,

    productFromShop: productFromShopSlice.reducer,
    productDetail: productDetailSlice.reducer,

    promotionFromShop: promotionFromShopSlice.reducer,
    promotionDetail: promotionDetailSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['some/bigNonSerializableAction'],
        ignoredPaths: ['some.largeSlice'],
        warnAfter: 100,
      },
    }),
});
