import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import stack from './modules/stack'
import cond from './modules/cond'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules:{
    stack,
    cond
  },
  state:{
    user:{
      type:'',
      erp:'',
      name:'',
      dept3Id:'-1',
      dept3Name:'',
      salerId:'',
      salerName:'',
      treeData:[]
    },//当前用户，type,erp,dept3Id,dept3Name
    year:-1,
    authority:{},//权限,
    versionList:[], // 可用的版本列表。最多三个
    currentVersionType:"",
  },
  getters:{
    getCurrentVersionType:state => state.currentVersionType,
    getVersionList:state => state.versionList,
    isDept3: state => { return state.user.type === 'dept'},
    erp:state => state.user.erp,
    getUser:state => {
      return state.user;
    },
    getErp:state => {
      return state.authority.erp;
    },
    getRoleType:state => {
      let roleMap = state.authority.roleMap;
      let roleTypeArr = [];
      if(roleMap != undefined){
        if(roleMap.DEPT_MANAGER != undefined && roleMap.DEPT_MANAGER.length > 0){
          roleTypeArr.push('DEPT_MANAGER');
        }
        if(roleMap.SALER != undefined && roleMap.SALER.length > 0){
          roleTypeArr.push('SALER');
        }
      }
      return roleTypeArr;
    },
    getRoleMap: state => {
      return state.authority.roleMap;
    }
  },
  mutations:{
    setCurrentVersionType(state,payload){state.currentVersionType = payload},
    setVersionList(state,payload){
      state.versionList = payload},
    setYear(state,payload){
      state.year = payload + 1000;
    },
    setAuthority:(state,payload) => {
      state.authority = payload;

      if(payload != undefined){
        let user = {};
        let erp = payload.erp;
        let roleMap = payload.roleMap;
        let roleType = 'DEPT_MANAGER';
        if(roleMap['DEPT_MANAGER'] != undefined){
          roleType = 'DEPT_MANAGER';
        }else{
          roleType = 'SALER';
        }
        user.erp = erp;
        user.type = roleType;
        user.name = payload.name;
        let deptList = roleMap[roleType];
        if(deptList != undefined && deptList.length > 0){
          let dept3Id = deptList[0].dept3Id;
          let dept3Name = deptList[0].dept3Name;
          let salerId = deptList[0].salerId;
          let salerName = deptList[0].salerName;
          user.dept3Id = dept3Id;
          user.dept3Name = dept3Name;
          user.salerId = salerId;
          user.salerName = salerName;
        }
        user.treeData = [];
        state.user = user;
      }
    },
    setUser:(state,payload) => {
      state.user = payload;
    },
    setUserTreeData:(state,payload) => {
      state.user.treeData = Object.freeze( payload );

    }
  },
  actions: {},
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
