import global from './global.js'
import qs from 'qs'


const categoryModel = {

    // 登陆
    getCategories: () => {
        const path = '/categories';
        return global.axios.get(path).then(res => res.data.rows);
    }
}

export default categoryModel;