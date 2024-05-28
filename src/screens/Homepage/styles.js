import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    box: {
        backgroundColor: "white",
    },
    headerContainer: {
        padding: 10,
        paddingLeft:0
    },
    headerBtnActive: {
        backgroundColor: "#0077ff",
    },
    headerBtn: {
        padding: 20,
        margin: 10,
        backgroundColor: "#00e5ff",
        borderRadius: 15,
        color: "white",
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        flexDirection: "row",
        margin: 10,
        gap: 15,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12.35,
        elevation: 19,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#00e5ff",
        marginBottom: 5,
    },
    textName: {
        maxWidth: 140,
        fontSize: 20,
        color: "#0077ff",
        fontWeight: "bold",
        minWidth: 140,
    },
    flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        gap: 10,
    },
    title: {
        fontSize: 24,
        backgroundColor: "tomato",
        textAlign: "center",
        padding: 10,
        color: "white",
    },
    textBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
