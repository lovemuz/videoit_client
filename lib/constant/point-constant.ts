const POINT_LIST: {
    POINT_4000: number,
    POINT_6600: number,
    POINT_18600: number,
    POINT_32000: number,
    POINT_60000: number,
    POINT_100000: number,
} = (function () {
    return {
        POINT_4000: 7500,
        POINT_6600: 12000,
        POINT_18600: 33000,
        POINT_32000: 55000,
        POINT_60000: 99000,
        POINT_100000: 149000,
    }
}())


const POINT_HISTORY: {
    TYPE_CALL: number,
    TYPE_CHAT: number,
    TYPE_ATTENDANCE: number,
    TYPE_GIFT: number,
    TYPE_EXCHANGE: number,
    TYPE_POST: number,
    TYPE_PAYMENT: number,
    PLUS: boolean,
    MINUS: boolean,
} = (function () {
    return {
        // 0 영상통화 , 1 채팅 , 2, 출석체크, 3.선물 구매 , 4. 환전 , 5. 게시글 구매
        TYPE_CALL: 0,
        TYPE_CHAT: 1,
        TYPE_ATTENDANCE: 2,
        TYPE_GIFT: 3,
        TYPE_EXCHANGE: 4,
        TYPE_POST: 5,
        TYPE_PAYMENT: 6,
        PLUS: true,
        MINUS: false,
    }
}())

const POINT_ATTENDANCE: {
    DEFAULT: number,
    SUBSCRIBE: number,
} = (function () {
    return {
        DEFAULT: 50,
        SUBSCRIBE: 1000,
    }
}())

export {
    POINT_LIST,
    POINT_HISTORY,
    POINT_ATTENDANCE
}