/**
 * table分页逻辑混入
 *
 */

import { getAction, postAction } from '@/api/manage'
import ls from '@/utils/ls_operation'
import { ACCESS_TOKEN } from '@/utils/root/local_storageKeys'

export default {
	data() {
		return {
			/* token header */
			tokenHeader: { 'Authorization': ls.get(ACCESS_TOKEN) },
			/* 查询列表用是否用post方法 */
			postMethod: false,
			/* 查询条件-请不要在queryParam中声明非字符串值的属性 */
			queryParam: {},
			/* 动态生成的查询条件，防止重置清除 */
			dynamicParam: {},
			/* 数据源 */
			dataSource: [],
			/* 分页参数 */
			ipagination: {
				current: 1,
				pageSize: 10,
				pageSizeOptions: ['10', '20', '30'],
				showTotal: (total, range) => {
					return range[0] + '-' + range[1] + ' 共' + total + '条'
				},
				showQuickJumper: true,
				showSizeChanger: true,
				total: 0,
			},

			/* table加载状态 */
			loading: false,
			/* table选中keys*/
			selectedRowKeys: [],
			/* table选中records*/
			selectionRows: [],

			/** 是否一进页面就开始加载数据 */
			loadByInit: true,

			url: {},
		}
	},

	created() {
		if (this.loadByInit) {
			this.loadData()
		}
	},

	methods: {
		//获取数据
		loadData(page) {
			return new Promise((resolve, reject) => {
				if (!this.url.list) {
					console.error('请设置url.list属性!')
					return
				}
				//加载数据 若传入参数1则加载第一页的内容
				if (page === 1) {
					this.ipagination.current = 1
				}

				let params = this.getQueryParams() //查询条件
				this.loading = true

				const fetchAction = this.postMethod ? postAction : getAction

				fetchAction(this.url.list, params)
					.then((res) => {
						if (res?.result) {
							this.dataSource = res.result?.records || []
							if (res?.result?.total) {
								this.ipagination.total = res.result.total
							}
						}

						resolve(res)
					})
					.catch((err) => {
						console.error('loadData err', err)
						reject(err)
					})
					.finally(() => {
						this.loading = false
						this.onClearSelected()
					})
			})
		},

		//查询当前页数据，若当前页无数据且分页数大于1，则再次查前一页
		searchQuery() {
			return new Promise((resolve, reject) => {
				const currentPage = this.ipagination.current
				this.loadData(currentPage)
					.then((res) => {
						const { result, success } = res
						if (success) {
							if (result?.records.length === 0 && currentPage > 1) {
								this.loadData(currentPage - 1)
							}
							resolve(res)
						} else {
							resolve({})
						}
					})
					.catch((err) => {
						console.error('loadData err', err)
						reject(err)
					})
			})
		},

		//处理重置按钮
		searchReset() {
			const queryParam = Object.assign({}, this.$options.data.call(this).queryParam)
			this.queryParam = { ...queryParam, ...this.dynamicParam }
			this.loadData(1)
			this.$message.success('重置搜索项成功!')
		},

		//生成查询条件
		getQueryParams() {
			//获取查询条件
			const params = Object.assign({}, this.queryParam, this.dynamicParam, {
				pageNo: this.ipagination.current,
				pageSize: this.ipagination.pageSize,
			})
			return params
		},

		//监听分页变化
		handleTableChange(pagination, filters, sorter) {
			console.log('filters', filters, sorter)

			this.ipagination = pagination
			this.loadData()
		},

		//监听选中行
		onSelectChange(selectedRowKeys, selectionRows) {
			this.selectedRowKeys = selectedRowKeys
			this.selectionRows = selectionRows
		},
		//清空选中行
		onClearSelected() {
			this.selectedRowKeys = []
			this.selectionRows = []
		},
	},
}
