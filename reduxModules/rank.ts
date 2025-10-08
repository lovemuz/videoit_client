const GETRANK = 'rank/GETRANK'
const UPDATERANK = 'rank/UPDATERANK'

export const getRank = () => ({ type: GETRANK })
export const updateRank = (input: any) => ({ type: UPDATERANK, input })

const initalState = {
    rank: [],
}

function rank(state = initalState, action: any) {
    switch (action.type) {
        case GETRANK:
            return state
        case UPDATERANK:
            return {
                rank: action.input,
            }
        default:
            return state
    }
}
export default rank