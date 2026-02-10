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

    getBuilding(): Observable<any> {
        return this.apiService.getData('building');
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

    getFloors(buildingId?: number): Observable<any> {
        const params = buildingId ? `?buildingId=${buildingId}` : '';
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

    getRooms(floorId?: number): Observable<any> {
        const params = floorId ? `?floorId=${floorId}` : '';
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

    getBeds(roomId?: number): Observable<any> {
        const params = roomId ? `?roomId=${roomId}` : '';
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
