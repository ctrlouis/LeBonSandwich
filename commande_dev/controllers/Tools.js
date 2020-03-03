"use strict";


class Tools {

    static formatDate(date =null) {
        if (date) {
            return new Date(date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year:'numeric'});
        }
        
        return new Date().toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year:'numeric'});
    }
    
    static formatHour(date =null) {
        if (date) {
            return new Date(date).toLocaleTimeString('fr-FR');
        }
        
        return new Date().toLocaleTimeString('fr-FR');
    }

    static formatDateHour(date =null) {
        return Tools.formatDate(date) + " " + Tools.formatHour(date);
    }

}

export default Tools;