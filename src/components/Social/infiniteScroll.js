import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

const InfiniteScroll = ({ fetchData, hasMore, loader, children }) => {
    const [loading, setLoading] = useState(false);

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 300;
        if (isCloseToBottom && !loading && hasMore) {
            fetchData();
        }
    };

    useEffect(() => {
        const fetchDataWrapper = async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        };

        const fetchDataOnMount = async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        };

        fetchDataOnMount();

        return () => {
        };
    }, []);

    return (
        <ScrollView
            onScroll={({ nativeEvent }) => handleScroll({ nativeEvent })}
            scrollEventThrottle={400}
        >
            {children}
            {loading && loader}
        </ScrollView>
    );
};

export default InfiniteScroll;
