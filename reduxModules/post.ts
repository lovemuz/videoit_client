const GETPOST = 'post/GETPOST'
const UPDATEPOST = 'post/UPDATEPOST'

export const getPost = () => ({ type: GETPOST })
export const updatePost = (input: any) => ({ type: UPDATEPOST, input })

const initalState = {
    post: [],
}

function post(state = initalState, action: any) {
    switch (action.type) {
        case GETPOST:
            return state
        case UPDATEPOST:
            return {
                post: action.input,
            }
        default:
            return state
    }
}
export default post