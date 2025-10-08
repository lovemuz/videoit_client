const POST_TYPE: {
    POST_NORMAL: number,
    POST_IMAGE: number,
    POST_VIDEO: number,
} = (function () {
    return {
        POST_NORMAL: 0,
        POST_IMAGE: 1,
        POST_VIDEO: 4,
    }
}())

export {
    POST_TYPE,
}