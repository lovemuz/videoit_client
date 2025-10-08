const GETPOINT = 'point/GETPOINT'
const UPDATEPOINT = 'point/UPDATEPOINT'

export const getPoint = () => ({ type: GETPOINT })
export const updatePoint = (input: any) => ({ type: UPDATEPOINT, input })

const initalState = {
    point: {
        amount: 0,
    },
}

function point(state = initalState, action: any) {
    switch (action.type) {
        case GETPOINT:
            return state
        case UPDATEPOINT:
            return {
                point: action.input,
            }
        default:
            return state
    }
}
export default point