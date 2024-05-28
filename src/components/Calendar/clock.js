import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Clock = ({ start, cancel, success, onTimeout }) => {
    const [time, setTime] = useState(1300);
    const [timeout, setTimeout] = useState(false);


    useEffect(() => {
        let timer;
        if (start) {
            timer = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 0) {
                        setTimeout(true)
                    }
                    return prevTime > 0 ? prevTime - 1 : 0;
                });
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [start]);

    useEffect(() => {
        if (!cancel || !success) {
            clearInterval(time);
            setTime(1300);
        }
    }, [cancel, success]);


    useEffect(() => {
        if (timeout) {
            onTimeout()
        }
    }, [timeout]);

    const timerDisplay = `${Math.floor(time / 60)
        .toString()
        .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

    return (
        <View>
            <Text style={styles.timer}>{timerDisplay}</Text>
        </View>
    );
};

export default Clock;

const styles = StyleSheet.create({
    timer: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
