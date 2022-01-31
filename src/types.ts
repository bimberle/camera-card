
export interface ICardConfig {
    title?: string;
    entity: string;
    praefixes?: string[];
}

export interface PictureGallery {
    tage: Array<Tag>;
    getTage(): Array<string>;
}

export interface Tag {
    date: Date;
    hours: Array<Hour>;
}

export interface Hour {
    hour: string;
    cams: Array<Cam>
}


export interface Cam {
    name: string;
    pictures: Array<Picture>;
}

export class Picture {
    url: string;
    timestamp: string;
    constructor(_url: string, _timestamp: string) {
        this.url = _url;
        this.timestamp = _timestamp;
    }
}


/*
fileList: 
'2022-01-28':
  '20:00':
    ingang:
      '20:29:33': ingang/2022-01-28/image22-01-28_20-29-33-66.jpg
      '20:29:32': ingang/2022-01-28/image22-01-28_20-29-32-64.jpg
      '20:20:51': ingang/2022-01-28/image22-01-28_20-20-51-71.jpg
      '20:09:50': ingang/2022-01-28/image22-01-28_20-09-50-65.jpg
      '20:03:58': ingang/2022-01-28/image22-01-28_20-03-58-68.jpg
  '19:00':
    ingang:
      '19:44:36': ingang/2022-01-28/image22-01-28_19-44-36-71.jpg
      '19:39:29': ingang/2022-01-28/image22-01-28_19-39-29-76.jpg
      '19:36:47': ingang/2022-01-28/image22-01-28_19-36-47-70.jpg
      '19:34:09': ingang/2022-01-28/image22-01-28_19-34-09-64.jpg
      '19:32:23': ingang/2022-01-28/image22-01-28_19-32-23-74.jpg
      '19:31:31': ingang/2022-01-28/image22-01-28_19-31-31-66.jpg
      '19:31:30': ingang/2022-01-28/image22-01-28_19-31-30-67.jpg
      '19:01:12': ingang/2022-01-28/image22-01-28_19-01-12-62.jpg
      '19:01:11': ingang/2022-01-28/image22-01-28_19-01-11-70.jpg
  '18:00':
*/