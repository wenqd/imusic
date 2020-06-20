const userstore = {
    namespaced: true,
    state: {
        user: {},
        profile:{}
    },
    mutations: {
        updateUser(state, user) {
            state.user = user
        },
        updateProfile(state, profile) {
            state.profile = profile
        },
    },
};
export default userstore