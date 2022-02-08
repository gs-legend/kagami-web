import apiClient from 'core/services/apiClient';
import dataService from 'core/data.service';

const DmsService = {
    viewDocument: (payload: any) => apiClient.post(dataService.BASE_URL + 'dms/viewDocument', payload, { withCredentials: true }),
};

export default DmsService;