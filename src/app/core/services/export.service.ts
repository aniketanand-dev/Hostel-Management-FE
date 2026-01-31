import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    downloadCSV(data: any[], filename: string) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = this.convertToCSV(data, headers);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename + '.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    private convertToCSV(objArray: any[], headers: string[]): string {
        const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';

        // Header row
        str += headers.join(',') + '\r\n';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in headers) {
                if (line != '') line += ',';

                const head = headers[index];
                let value = array[i][head];

                // Handle null/undefined
                if (value === null || value === undefined) {
                    value = '';
                }

                // Quote strings if they contain commas
                if (typeof value === 'string' && value.includes(',')) {
                    value = `"${value}"`;
                }

                line += value;
            }
            str += line + '\r\n';
        }
        return str;
    }
}
