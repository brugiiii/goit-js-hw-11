import axios from 'axios';

export default class FetchApiService {
  constructor() {
    this._request = '';
    this.page = 1;
  }

  fetchPhotos() {
    const options = {
      params: {
        key: '34287533-73b6140ff373420767809a55e',
        q: `${this._request}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '40',
        page: `${this.page}`,
      },
    };

    this.page += 1;

    return axios.get('https://pixabay.com/api/', options).then(res => {
      this.page += 1;
      return res.data.hits;
    });
  }

  resetPage() {
    this.page = 1;
  }

  get request() {
    return this._request;
  }

  set request(newRequest) {
    this._request = newRequest;
  }
}
