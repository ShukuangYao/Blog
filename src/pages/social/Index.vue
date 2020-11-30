<template>
    <Layout>
        <el-card shadow="never" style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px">
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane :label="'粉丝 '+user.followers" style="padding: 5px" name="followers">
                    <div>
                        <div v-if="$page.followers.edges.length">
                            <el-row style="min-height: 200px; ">
                                <el-col :span="8" v-for="(item,index) in $page.followers.edges" :key="'followers'+index" style="padding: 10px">
                                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                        <i class="el-icon-star-off"></i>&emsp;
                                        <g-link :to="'/social/details/'+item.node.login"  style=" text-decoration:none;cursor:pointer">{{item.node.login}}</g-link>
                                        <br>
                                        <i class="el-icon-message"></i>&emsp;
                                        <a :href="item.node.html_url" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                        <br>
                                        <img :src="item.node.avatar_url" style="width: 100%;border-radius:5px;margin-top: 5px">
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div style="text-align: center;margin-top: 10px">
                                <el-pagination 
                                    @current-change="onSelect" background layout="prev, pager, next" 
                                    :current-page="$page.followers.pageInfo.currentPage"
                                    :page-size="9" :total="$page.followers.pageInfo.totalPages * 9">
                                </el-pagination>
                            </div>
                        </div>
                        <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                            <font style="font-size: 30px;color:#dddddd ">
                                <b>(￢_￢) 没有一个粉丝</b>
                            </font>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="'关注 '+user.following" name="following" style="padding: 5px">
                    <div>
                        <div v-if="followings.length">
                            <el-row style="min-height: 200px; ">
                                <el-col :span="8" v-for="(item,index) in followings" :key="'following'+index" style="padding: 10px">
                                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                        <i class="el-icon-star-off"></i>&emsp;
                                        <router-link :to="'/social/details/'+item.login"  style=" text-decoration:none;cursor:pointer">{{item.login}}</router-link>
                                        <br>
                                        <i class="el-icon-message"></i>&emsp;
                                        <a :href="item.html_url" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                        <br>
                                        <img :src="item.avatar_url" style="width: 100%;border-radius:5px;margin-top: 5px">
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div style="text-align: center;margin-top: 10px">
                                <el-pagination 
                                    @current-change="onSelect" background layout="prev, pager, next" 
                                    :current-page="$route.params.page || 1"
                                    :page-size="9" :total="user.following">
                                </el-pagination>
                            </div>
                        </div>
                        <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                            <font style="font-size: 30px;color:#dddddd ">
                                <b>(￢_￢) 还没有关注一个人</b>
                            </font>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </Layout>
</template>
<page-query>
query ($page: Int) {
    users: allUser{
        edges{
            node{
                followers
                following
                githubUsername
            }
        }
    }
    followers: allFollower(perPage: 9, page: $page) @paginate{
        pageInfo {
            totalPages
            currentPage
        }
        edges{
            node{
                id
                login
                html_url
                avatar_url
            }
        }
    }
}
</page-query>
<script>
import {request} from '@/utils/request'
    export default {
        name: 'socialPage',
        metaInfo:{
            title: '辣子鸡的博客'
        },
        data () {
            return {
                activeTab: this.$route.query.activeTab || "followers",
                followings:[]
            }
        },
        computed: {
            user(){
                return this.$page.users.edges[0].node
            }
        },
        async mounted () {
            const {data} = await request.get(`users/${this.user.githubUsername}/following?page=${this.$route.params.page || 1}&per_page=9`)
            this.followings = data
        },
        watch: {
            activeTab:function(newVal){
                this.$router.push({
                    url: '/social',
                    query:{
                        activeTab: newVal
                    }
                })
            }
        },
        methods: {
            onSelect(page) {
                this.$router.push({
                    url: '/social',
                    params: {
                        page: page === 1 ? null: page,
                    },
                    query:{
                        activeTab: this.activeTab
                    }
                })
            },
        }
    }
</script>