<template>
	<section class="menu-wrap">
		<!-- <a-menu v-model="defaultActive" :openKeys.sync="openKeys" mode="inline" @click="handleClick">
			<a-sub-menu key="/elderinfo" @titleClick="titleClick">
				<span slot="title">
					<a-icon type="solution" />
					<span>老人信息</span>
				</span>
				<a-menu-item key="/elderinfo/registered">在院老人</a-menu-item>
				<a-menu-item key="/elderinfo/goout">外出老人</a-menu-item>
				<a-menu-item key="/elderinfo/unregistered">出院老人</a-menu-item>
				<a-menu-item key="/elderinfo/passed">死亡老人</a-menu-item>
			</a-sub-menu>

			<a-sub-menu key="/healthcheck" @titleClick="titleClick">
				<span slot="title">
					<a-icon type="medicine-box" />
					<span>健康检查</span>
				</span>
				<a-menu-item key="/healthcheck/daily">日常检查</a-menu-item>
				<a-menu-item key="/healthcheck/anomaly">异常提示</a-menu-item>
			</a-sub-menu>

			<a-sub-menu key="/systemsetting" @titleClick="titleClick">
				<span slot="title">
					<a-icon type="setting" />
					<span>系统设置</span>
				</span>
				<a-menu-item key="/systemsetting/nursingproject">护理项目</a-menu-item>
				<a-menu-item key="/systemsetting/buildingmanagement">楼栋管理</a-menu-item>
				<a-menu-item key="/systemsetting/personnellabel">人员标签</a-menu-item>
			</a-sub-menu>
		</a-menu> -->
		<v-menu :options="renderPermissionList" :openKeys.sync="openKeys" :collapsed.sync="sidebar.open"></v-menu>
	</section>
</template>

<script>
import VMenu from './menu'

import { mapActions, mapGetters } from 'vuex'
import { asyncRouters } from '@/router/index'

export default {
	components: { VMenu },

	data() {
		return {
			defaultActive: [],
			openKeys: [],
		}
	},

	computed: {
		...mapGetters(['permissionList', 'sidebar']),
		renderPermissionList() {
			console.log('this.permissionList', this.permissionList)
			const renderList = [...this.permissionList, ...asyncRouters]
			console.log('renderList', renderList)
			return renderList
		},
	},

	watch: {
		$route: {
			immediate: true,
			handler(newValue) {
				console.log('newValue.matched[0]', newValue.matched[0])
				this.openKeys = [newValue.matched[0].path]
				this.setMenuActive(newValue.fullPath)
			},
		},

		openKeys(val) {
			console.log('openKeys', val)
		},
	},

	created() {
		console.log('permissionList', this.permissionList)
	},

	methods: {
		...mapActions('display', ['initUserInfo']),

		toggleCollapsed() {
			this.collapsed = !this.collapsed
		},

		handleClick({ item, key, keyPath }) {
			this.$router.push(key).catch((err) => {})
		},
		titleClick(e) {
			console.log('titleClick', e)
		},

		//设置菜单默认选中
		setMenuActive(path) {
			this.defaultActive = [path]
		},
	},
}
</script>

<style>
.menu-wrap .ant-menu {
	border: none;
}
</style>

<style scoped>
.menu-wrap {
	margin-top: 1.4rem;
}
</style>
