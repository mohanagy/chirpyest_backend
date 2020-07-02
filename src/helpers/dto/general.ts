export const headerData = (data: any) => data.headers;

export const bodyData = (data: any) => data.body;

export const paramsData = (data: any) => data.params;

export const filterData = (data: any) => ({ where: data });
