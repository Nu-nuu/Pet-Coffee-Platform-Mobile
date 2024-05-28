import { Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');


const COLORS = {
    primary: "#B75815",
    secondary: "#D36618",
    tertiary: "#EA8B48",
    quaternary: "#FCF1E8",

    gray1: "#E8E8E8",
    gray2: "#919191",
    gray3: "#5E5E5E",
    gray5: "#2B2B2B",

    bgr: "#FFF6F6",
    bgr2: "rgb(20, 27, 45)",
    primary2: 'rgb(112, 216, 189)',
    button: "rgb(76, 206, 172)",

    white: "#FFFFFF",
    black: "#050505",
    blackBold: "#65676B",

    error: '#B22222',
    success: '#2B9F5A',

    white100: 'rgba(255, 255, 255, 0.1)',
    white200: 'rgba(255, 255, 255, 0.2)',
    white300: 'rgba(255, 255, 255, 0.3)',
    white400: 'rgba(255, 255, 255, 0.4)',
    white500: 'rgba(255, 255, 255, 0.5)',
    white600: 'rgba(255, 255, 255, 0.6)',
    white700: 'rgba(255, 255, 255, 0.7)',
    white800: 'rgba(255, 255, 255, 0.8)',
    white900: 'rgba(255, 255, 255, 0.9)',

    none: 'rgba(232, 232, 232, 0.5)',


    primary100: 'rgba(183, 88, 21, 0.1)',
    primary200: 'rgba(183, 88, 21, 0.2)',
    primary300: 'rgba(183, 88, 21, 0.3)',
    primary400: 'rgba(183, 88, 21, 0.4)',
    primary500: 'rgba(183, 88, 21, 0.5)',
    primary900: 'rgba(183, 88, 21, 0.9)',


    male: 'blue',
    female: "#FF9AD5",
    male200: 'rgba(0, 0, 255, 0.2)',
    female200: 'rgba(255, 154, 213, 0.2)',

    yellow: '#F5BA41',
    yellow200: 'rgba(255, 255, 0, 0.5)'

}

const SIZES = {
    xs: 10,
    s: 12,
    xm: 14,
    m: 16,
    l: 20,
    xl: 24,
    xxl: 44,
    height,
    width
}

const SHADOWS = {
    s: {
        elevation: 1,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 18,
        marginBottom: 2
    },
    m: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
    sfe: {
        elevation: 1,
        shadowColor: COLORS.female,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 18,
        marginBottom: 1
    },
};



const TEXTS = {
    titleLogo: {
        fontSize: SIZES.xxl,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    titleMax: {
        fontSize: SIZES.xl + 4,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    title: {
        fontSize: SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    subTitle: {
        fontSize: SIZES.l,
        color: COLORS.black,
    },
    heading: {
        fontSize: SIZES.l,
        fontWeight: '500',
        color: COLORS.black,
    },
    content: {
        fontSize: SIZES.m,
        color: COLORS.blackBold,
    },
    subContent: {
        fontSize: SIZES.xm,
        color: COLORS.gray2,
    },


    titleMaxL: {
        fontSize: SIZES.xl + 4,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    titleL: {
        fontSize: SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    subTitleL: {
        fontSize: SIZES.l,
        color: COLORS.white,
    },
    headingL: {
        fontSize: SIZES.l,
        fontWeight: '500',
        color: COLORS.white,
    },
    contentL: {
        fontSize: SIZES.m,
        color: COLORS.gray1,
    },
    subContentL: {
        fontSize: SIZES.xm,
        color: COLORS.gray1,
    }
}

const BUTTONS = {
    recFull: {
        height: SIZES.width / 9,
        width: SIZES.width / 1.3,
        borderRadius: 15,
    },
    recMax: {
        height: SIZES.width / 9,
        width: SIZES.width / 3,
        borderRadius: 10,
    },
    recMid: {
        height: 36,
        width: 95,
        borderRadius: 6,
    },
    recMin: {
        height: 28,
        width: 60,
        borderRadius: 7,
    },
    cub: {
        height: SIZES.width / 9,
        width: SIZES.width / 8,
        borderRadius: 10,
    },
}

const AVATARS = {
    mini: {
        width: 20,
        height: 20,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.gray1
    },
    min: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: COLORS.gray1
    },

    mid: {
        width: 54,
        height: 54,
        borderRadius: 27,
        overflow: 'hidden',
        backgroundColor: COLORS.gray1
    },

    xmid: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 8,
        borderColor: COLORS.white,
        backgroundColor: COLORS.gray1
    },
    max: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 10,
        borderColor: COLORS.white,
        backgroundColor: COLORS.gray1
    },

}

const BRS = {
    out: 18,
    in: 10,


}

const ICONS = {
    xs: 12,
    s: 16,
    xm: 22,
    m: 24,
    l: 36,

    coverL: {
        borderRadius: 18,
        width: 36,
        height: 36,
        backgroundColor: COLORS.white100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverD: {
        borderRadius: 18,
        width: 36,
        height: 36,
        backgroundColor: COLORS.primary100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverLM: {
        borderRadius: 14,
        width: 28,
        height: 28,
        backgroundColor: COLORS.white100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverDM: {
        borderRadius: 14,
        width: 28,
        height: 28,
        backgroundColor: COLORS.primary100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverLS: {
        borderRadius: 10,
        width: 20,
        height: 20,
        backgroundColor: COLORS.white100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverDS: {
        borderRadius: 10,
        width: 20,
        height: 20,
        backgroundColor: COLORS.primary100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverNum: {
        borderRadius: 14,
        width: 28,
        height: 28,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverCub: {
        height: SIZES.width / 9,
        width: SIZES.width / 9,
        borderRadius: BRS.in,
        backgroundColor: COLORS.primary100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    coverPro: {
        height: SIZES.width / 10,
        width: SIZES.width / 10,
        borderRadius: BRS.in,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center'
    }
}

export { COLORS, SIZES, SHADOWS, ICONS, TEXTS, BRS, BUTTONS, AVATARS };