const GETROOM = 'room/GETROOM'
const UPDATEROOM = 'room/UPDATEROOM'

export const getRoom = () => ({ type: GETROOM })
export const updateRoom = (input: any) => ({ type: UPDATEROOM, input })

const initalState = {
    room: [],
}

function room(state = initalState, action: any) {
    switch (action.type) {
        case GETROOM:
            return state
        case UPDATEROOM:
            return {
                room: action.input,
            }
        default:
            return state
    }
}
export default room