import global from './global.js'
import qs from 'qs'


const categoryModel = {

    // 登陆
    getCategories: (pageSize = -1) => {
        const path = '/categories';
        return global.searchResource(path, null, null, pageSize).then(data => data.rows);
    }
}

export default categoryModel;