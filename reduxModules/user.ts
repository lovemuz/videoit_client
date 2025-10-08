import { USER_ROLE } from "../lib/constant/user-constant"

const GETUSER = 'user/GETUSER'
const UPDATEUSER = 'user/UPDATEUSER'

export const getUser = () => ({ type: GETUSER })
export const updateUser = (input: any) => ({ type: UPDATEUSER, input })

const initalState = {
    user: {
        id: null,
        phone: null,
        link: null,
        linkChange: null,
        password: null,
        email: null,
        name: null,
        country: null,
        nick: null,
        profile: null,
        introduce: null,
        suggestion: null,
        callState: null,
        age: null,
        gender: null,
        lastVisit: null,
        attendanceCheck: null,
        roles: 0,
        banReason: null,
        refreshToken: null,
        pushToken: null,
        deletedAt: null,
        createdAt: null,
        updatedAt: null,
        real_gender: null,
        real_birthday: null,
    },
}

function user(state = initalState, action: any) {
    switch (action.type) {
        case GETUSER:
            return state
        case UPDATEUSER:
            return {
                user: action.input,
            }
        default:
            return state
    }
}
export default user