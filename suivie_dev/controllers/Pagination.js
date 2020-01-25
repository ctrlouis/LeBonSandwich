"use strict";


const defaultPageSize = 10;
const maxPageSize = 50;

class Pagination {

    // return correct page size value
    static getPageSize(req) {
        const querySize = req.query.size;

        // if null or lower then 0
        if (!querySize || querySize <= 0) {
            return defaultPageSize;
        }

        // if higher then maxPageSize
        if (querySize > maxPageSize) {
            return maxPageSize;
        }

        return querySize;
    }

    // return number of the first row and last row of page
    static getPage(req, rowNumber, pageSize) {
        const queryPage = req.query.page;
        const maxPageNumber = (rowNumber / pageSize) - (rowNumber / pageSize) % 1;
        const pagination = {
            size: pageSize,
            first: 0,
            last: maxPageNumber
        };

        pagination.queryOffset = pageSize * queryPage;
        pagination.queryLimit = pagination.queryOffset + pageSize;

        // if query page is lower then 0
        if (!queryPage || queryPage < 0) {
            pagination.queryOffset = 0;
            pagination.queryLimit = pagination.queryOffset + pageSize;
        }

        // queryPage higher then the max page number
        if (queryPage >= maxPageNumber) {
            pagination.queryLimit = rowNumber;
            pagination.queryOffset = rowNumber - rowNumber % pageSize;
        }

        // previous page number
        pagination.previous = queryPage - 1;
        if (pagination.previous < 1) pagination.previous = null;

        // next page number
        pagination.next = 1 + parseFloat(queryPage);
        if (pagination.next > maxPageNumber) pagination.next = null;

        return pagination;
    }

    static getLinks(pagination, uri) {
        let links = {};

        if (pagination.next) {
            links.next = {};
            links.next.href = uri + "?page=" + pagination.next + "&size=" + pagination.size;
        }

        if (pagination.previous) {
            links.prev = {};
            links.prev.href = uri + "?page=" + pagination.previous + "&size=" + pagination.size;
        }

        links.first = {};
        links.first.href = uri + "?page=" + pagination.first + "&size=" + pagination.size;

        links.last = {};
        links.last.href = uri + "?page=" + pagination.last + "&size=" + pagination.size;


        return links;
    }

}

export default Pagination;
