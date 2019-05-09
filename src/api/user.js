import global from './global.js'
import qs from 'qs'


const userModel = {

    // 登陆
    getUsers: (pageSize = -1) => {
        const path = '/users';
        return global.searchResource(path, null, null, pageSize).then(data => data.rows);
    }
}

export default userModel;