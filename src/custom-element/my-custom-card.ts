import { HomeAssistant } from "../ha-types";
import { html, css, LitElement, CSSResultGroup, TemplateResult, PropertyValues } from "lit";
import { property } from "lit/decorators";
import {repeat} from 'lit-html/directives/repeat.js';
import { Cam, ICardConfig, Picture, PictureGallery, Tag } from "../types";
import styles from "./card.css";
import { hasConfigOrEntityChanged } from "../has-changed";

/**
 * Main card class definition
 */
export class MyCustomCard extends LitElement {

    @property({ attribute: false })
    private cardTitle: string = "Card header";

    @property({ attribute: false })
    private state: string = "";

    @property({ attribute: false})
    private praefixes?: string[];

    private entity: string = "";

    @property() private _config?: ICardConfig;

    @property({ type: Number }) selectedTab: number = 0;
    @property({ type: String }) selectedDay: string = ""
    @property({ type: String }) selectedHour: string = "";
    @property({ type: String }) selectedCam: string = "";
    @property({ type: String }) selectedPic: string = "";

    private entityObj: any = undefined;
    private gallery: any = undefined;
    private localpath: string = "";
    private localpathReplace: string = "config/www";

    @property({ type: Array }) private availableDays?: string[];
    @property({ type: Array }) private availableHours?: string[];
    @property({ type: Array }) private availableCams?: string[];
    @property({ type: Array }) private availablePics: Array<Picture> = [];


    private _loadDays():void {
        this.availableDays = Object.keys(this.gallery);
        this._selectDay(this.availableDays[0]);
    }

    private _selectDay(tag: string) : void {
        if(tag!= '' && this.gallery) {
            this.selectedDay = tag;
            this.availableHours = Object.keys(this.gallery[this.selectedDay]) as Array<string>;
            this._selectHour(this.availableHours[0]);
        }
        
    }

    private _selectHour(hour: string) :void {
        this.selectedHour = hour;
        this.availableCams = Object.keys(this.gallery[this.selectedDay][this.selectedHour]) as Array<string>;
        this._selectCam(this.availableCams[0]);
    }

    private _selectCam(cam: string) :void {
        this.selectedCam = cam;
        //this.availablePics = [];
        Object.entries(this.gallery[this.selectedDay][this.selectedHour][this.selectedCam]).forEach((thisobj, index) => {
            var picurl = this.localpath + thisobj[1];
            this.availablePics.push({ timestamp: thisobj[0], url: picurl})
        })

        // TODO
        // this.availablePics kommt nicht bei HTML an, dort ist das Object noch alt


        if(this.availablePics.length > 0)
            this._selectPic(this.availablePics[0]);
    }

    private _selectPic(pic: Picture) : void {
        this.selectedPic = pic.timestamp;
        //console.log(pic);
    }


    /**
     * CSS for the card
     */
    static get styles(): CSSResultGroup {
        return css(<TemplateStringsArray><any>[styles]);
    }

    /**
     * Called on every hass update
     */
    set hass(hass: HomeAssistant) {
        if (!this.entity || !hass.states[this.entity]) {
            return;
        }

        this.state = hass.states[this.entity].state;
        this.entityObj = hass.states[this.entity];
        this.localpath = this.entityObj.attributes.path.replace(this.localpathReplace,'local');
    }

    /**
     * Called every time when entity config is updated
     * @param config Card configuration (yaml converted to JSON)
     */
    setConfig(config: ICardConfig): void {
        this.entity = config.entity;
        this.cardTitle = config.title || this.cardTitle;
        this.praefixes = config.praefixes;
    }

    /**
     * Renders the card when the update is requested (when any of the properties are changed)
     */
    render(): TemplateResult 
    {

        this.gallery = this.entityObj.attributes.fileList;

        //var locations: Array<PictureGallery> = JSON.parse(this.gallery);
        if(this.gallery) {
            this._loadDays();
            return html`
                <ha-card>
                    <div class="card-header">
                        <div class="truncate">
                            ${this.cardTitle}
                        </div>
                    </div>
                    <div class="card-content">
            
                        <div id='days'>
                            <paper-tabs scrollable class='smallTabs'>
                            ${this.availableDays?.map((tag: string) => {
                                return html`
                                <paper-tab @click=${() => this._selectDay(tag)}>${tag}</paper-tab>
                                `;
                            })}
                            </paper-tabs>
                        </div>

                        <div id='hours'>
                            <paper-tabs scrollable class='smallTabs'>
                                ${this.availableHours?.map((hour: string) => {
                                    return html`
                                        <paper-tab @click=${() => this._selectHour(hour)}>${hour}</paper-tab>
                                        `;
                                        })}
                            </paper-tabs>
                        </div>

                        <div id='cams'>
                            <paper-tabs scrollable class='smallTabs'>
                                ${this.availableCams?.map((cam: string) => {
                                    return html`
                                        <paper-tab @click=${() => this._selectCam(cam)}>${cam}</paper-tab>
                                        `;
                                        })}
                            </paper-tabs>
                        </div>

                        <div id='pics'>
                                ${this.availablePics.map((pic: Picture) => {
                                    return html`<div class='previews'><img src=${pic.url} class='previews'></img><div class='previewtimestamp'>${pic.timestamp}</div></div>`;
                                    })}
                            
                        </div>
                    </div>

                </ha-card>
                `;
        }
        else
        {
            return html`<div>Loading...</div>`;
        }
        

        
    }
    protected shouldUpdate(changedProps: PropertyValues): boolean {
        if (changedProps.has("fileList")) {
            return true;
        }
    
        return hasConfigOrEntityChanged(this, changedProps);
        }
    
    protected updated(changedProps: PropertyValues) {
        super.updated(changedProps);
    
        if (changedProps.has("hass")) {
            const stateObj = this.hass!.states[this._config!.entity];
            const oldHass = changedProps.get("hass") as this["hass"];
            const oldStateObj = oldHass
            ? oldHass.states[this._config!.entity]
            : undefined;
    
        }
    }

}

