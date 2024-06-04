import { STATUS } from "../../../data/constants";

export type ErrorType = {
    type: STATUS,
    message: string
}

export type ImportSourceType = {
    src: string,
    overwrite: boolean, 
    dbms: string
}

export type importDataType = {
    type: STATUS,
    message: string
}