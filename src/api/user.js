import global from './global.js'
import qs from 'qs'


const userModel = {

    // 登陆
    getUsers: () => {
        const path = '/users';
        return global.axios.get(path).then(res => res.data.rows);
    }
}

export default userModel;
