
export interface ICardConfig {
    title?: string;
    entity: string;
    path_replace?: string;
    cam_entity?: string;
}


export class Picture {
    url: string;
    timestamp: string;
    constructor(_url: string, _timestamp: string) {
        this.url = _url;
        this.timestamp = _timestamp;
    }
}

