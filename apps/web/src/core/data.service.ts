class DataService {
    BASE_URL: string;

    constructor() {
        if (window.location.href.indexOf('/app/') > -1) {
            this.BASE_URL = '../'
        } else if (window.location.href.indexOf('/kagami-generated') > -1) {
            this.BASE_URL = '';
        } else {
            this.BASE_URL = "http://prod.generatedapp.kagamierp.com:12019/kagami-generated_WDCL_dummy/";
            this.BASE_URL = "https://prod.generatedapp.kagamierp.com:12004/kagami-generated_MohanBoardsNewNew/";
            this.BASE_URL = "https://dev2.kagamierp.com:12002/kagami-generated_PnR/";
            this.BASE_URL = "https://demo.kagamierp.com:12009/kagami-generated_MBPL_NEW/";
        }
    }
}

export default new DataService();