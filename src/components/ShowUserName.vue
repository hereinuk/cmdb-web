<template>
    <span>{{showName}}</span>
</template>

<script>
    import api from '../api'
    import * as http from '../http'
    export default {
        data() {
            return {
                userInfo: null
            }
        },
        computed: {
            showName() {
                if (this.userInfo) {
                    return this.userInfo.name
                } else {
                    return ''
                }
            }
        },
        props: ['userID'],
        methods: {
            getUserInfo() {
                http.fetch(api.getUserById(this.userID)).then(data => {
                    this.userInfo = data.data
                })
            }
        },
        watch: {
            envID() {
                if (this.userID) {
                    this.getUserInfo()
                } else {
                    this.showName = ''
                }
            }
        },
        created() {
            if (this.userID) {
                this.getUserInfo()
            }
        }
    }

</script>

<style>


</style>
