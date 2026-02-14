import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OnBoardingService {

    constructor(
        private apiService: ApiService
    ) { }

    // Building APIs
    createBuilding(payload: any): Observable<any> {
        return this.apiService.postData('building', payload);
    }

    getBuilding(availableOnly?: boolean): Observable<any> {
        const params = availableOnly ? '?availableOnly=true' : '';
        return this.apiService.getData(`building${params}`);
    }

    updateBuilding(id: number, payload: any): Observable<any> {
        return this.apiService.putData(`building/${id}`, payload);
    }

    deleteBuilding(id: number): Observable<any> {
        return this.apiService.deleteData(`building/${id}`);
    }

    // Floor APIs
    createFloor(payload: any): Observable<any> {
        return this.apiService.postData('floor', payload);
    }

    getFloors(buildingId?: number, availableOnly?: boolean): Observable<any> {
        let params = buildingId ? `?buildingId=${buildingId}` : '';
        if (availableOnly) {
            params += (params ? '&' : '?') + 'availableOnly=true';
        }
        return this.apiService.getData(`floor${params}`);
    }

    getFloorById(id: number): Observable<any> {
        return this.apiService.getData(`floor/${id}`);
    }

    updateFloor(id: number, payload: any): Observable<any> {
        return this.apiService.putData(`floor/${id}`, payload);
    }

    deleteFloor(id: number): Observable<any> {
        return this.apiService.deleteData(`floor/${id}`);
    }

    // Room APIs
    createRoom(payload: any): Observable<any> {
        return this.apiService.postData('room', payload);
    }

    getRooms(floorId?: number, availableOnly?: boolean): Observable<any> {
        let params = floorId ? `?floorId=${floorId}` : '';
        if (availableOnly) {
            params += (params ? '&' : '?') + 'availableOnly=true';
        }
        return this.apiService.getData(`room${params}`);
    }

    getRoomById(id: number): Observable<any> {
        return this.apiService.getData(`room/${id}`);
    }

    updateRoom(id: number, payload: any): Observable<any> {
        return this.apiService.putData(`room/${id}`, payload);
    }

    deleteRoom(id: number): Observable<any> {
        return this.apiService.deleteData(`room/${id}`);
    }

    // Bed APIs
    createBed(payload: any): Observable<any> {
        return this.apiService.postData('bed', payload);
    }

    getBeds(roomId?: number, availableOnly?: boolean): Observable<any> {
        let params = roomId ? `?roomId=${roomId}` : '';
        if (availableOnly) {
            params += (params ? '&' : '?') + 'availableOnly=true';
        }
        return this.apiService.getData(`bed${params}`);
    }

    getBedById(id: number): Observable<any> {
        return this.apiService.getData(`bed/${id}`);
    }

    updateBed(id: number, payload: any): Observable<any> {
        return this.apiService.putData(`bed/${id}`, payload);
    }

    deleteBed(id: number): Observable<any> {
        return this.apiService.deleteData(`bed/${id}`);
    }
}
