import { HomeAssistant } from "../ha-types";
import { html, css, LitElement, CSSResultGroup, TemplateResult, PropertyValues } from "lit";
import { property } from "lit/decorators";
import { ICardConfig, Picture } from "../types";
import styles from "./card.css";
import { hasConfigOrEntityChanged } from "../has-changed";

/**
 * Main card class definition
 */
export class MyCustomCard extends LitElement {

    @property({ attribute: false })
    private cardTitle?: string

    @property({ attribute: false })
    private state: string = "";

    @property({ attribute: false})
    private patch_replace?: string;

    @property({ attribute: false})
    private cam_entity?: string;

    private fileListobj: any;

    @property({type: Array})
    availableDays: Array<string> = [];

    @property({type: Array})
    availableHours: Array<string> = [];

    @property({type: Array})
    availableCams: Array<string> = [];

    @property({type: Array})
    availablePics: Array<Picture> = [];

    @property({type: String})
    selectedDay: string = ""
    @property({type: String})
    selectedHour: string = "Start"
    @property({type: String})
    selectedCam: string = ""
    @property({type: Picture})
    selectedPic?: Picture
    @property({type: Boolean})
    liveSelected: boolean = true

    private entity: string = "";

    @property() private _config?: ICardConfig;

    private entityObj: any = undefined;
    private localpath: string = "";
    private camObj: any = undefined;
    private camView: string = "live";
    private _hass: any;
    

    private _init():void {
        if(this.fileListobj) {  
            this.availableDays = Object.keys(this.fileListobj);
            this._selectDay(this.availableDays[0]);
            // Load LIVE on Reload if set
            if(this.cam_entity)
                this._selectLive();
                
        }
    }

    private _selectDay(day: string) : void {
        if(day!= '' && this.fileListobj) {
            this.selectedDay = day;
            this.availableHours = Object.keys(this.fileListobj[this.selectedDay]) as Array<string>;
            this._selectHour(this.availableHours[0]);
        }
        
    }

    private _selectHour(hour: string) :void {
        if(hour != '' && this.fileListobj) {
            this.selectedHour = hour;
            this.availableCams = Object.keys(this.fileListobj[this.selectedDay][this.selectedHour]) as Array<string>;
            this._selectCam(this.availableCams[0]);
        }
        
    }

    private _selectCam(cam: string) :void {
        if(cam != '' && this.fileListobj) {
            this.selectedCam = cam;
            const newPics: Array<Picture> = [];
            
            Object.entries(this.fileListobj[this.selectedDay][this.selectedHour][this.selectedCam]).forEach((thisobj, index) => {
                var picurl = this.localpath + thisobj[1];
                newPics.push({ timestamp: thisobj[0], url: picurl})
            })

            this.availablePics = newPics;

            this._selectPic(newPics[0]);
        }
        
    }

    private _selectPic(pic: Picture) : void {
        this.selectedPic = pic;
        this.liveSelected = false;
    }
    private _selectLive(): void {
        //this.selectedPic = { timestamp: "LIVE", url: this.camObj.attributes.entity_picture}
        this.availablePics = [];
        this.liveSelected = true;
    }


    

    /**
     * Renders the card when the update is requested (when any of the properties are changed)
     */
    render(): TemplateResult 
    {
        if(this.availableDays) {
        return html`
            <ha-card>
                ${this.cardTitle ? html`
                <div class="card-header">
                    <div class="truncate">
                        ${this.cardTitle}
                    </div>
                </div>` : html ``}
                <div class="card-content">
                    <div class="selectsArea">
                        ${this.renderDays()}
                        ${this.renderHours()}
                        ${this.renderCams()}
                    </div>
                    <div class="archivContainer">
                        <div class="previewArea">
                            ${this.renderPreview()}
                        </div>
                        <div class="pictureContainer">
                            ${this.renderPictures()}
                        </div>
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

    private renderDays(): TemplateResult
    {
        return html`
        <div id='days'>
            <paper-tabs scrollable class='smallTabs'>
            ${this.camObj? html`<paper-tab @click=${() => this._selectLive()}>LIVE</paper-tab>` : html``}
            ${this.availableDays?.map((tag: string) => {
                return html`
                <paper-tab @click=${() => this._selectDay(tag)}>${tag}</paper-tab>
                `;
            })}
            </paper-tabs>
        </div>
        `;
    }
    
    private renderPreview(): TemplateResult {
        if(this.liveSelected)
            return html`
            <div class="fullImage">
                <hui-image 
                .hass=${this._hass}
                .cameraImage=${this.cam_entity}
                .entity=${this.cam_entity}
                .cameraView=${this.camView}
                ></hui-image>
                <div class="footer">${this.camObj.attributes.friendly_name}</div>
            </div>
            `;
        else
            return html`
                <img src=${this.selectedPic?.url} class='fullImage'>
                <div class='previewtimestamp'>${this.selectedPic?.timestamp}</div>
        `;


    }


    private renderHours(): TemplateResult
    {
        return html`
        <div id='hours'>
            <paper-tabs scrollable class='smallTabs'>
                ${this.availableHours?.map((hour: string) => {
                    return html`
                        <paper-tab @click=${() => this._selectHour(hour)}>${hour}</paper-tab>
                        `;
                        })}
            </paper-tabs>
        </div>
        `;
    }


    private renderCams(): TemplateResult
    {
        return html`
        <div id='cams'>
            <paper-tabs scrollable class='smallTabs'>
                ${this.availableCams?.map((cam: string) => {
                    return html`
                        <paper-tab @click=${() => this._selectCam(cam)}>${cam}</paper-tab>
                        `;
                        })}
            </paper-tabs>
        </div>
        `;
    }



    private renderPictures(): TemplateResult 
    {
        return html`
            ${this.availablePics.map((pic: Picture) => {
                return html`
                <div @click=${() => this._selectPic(pic)} class="${pic.url == this.selectedPic?.url ? html`previewPicContainerSelected` : html``}">
                    <div class='picBox'>
                        <img src=${pic.url} class='previewPic'>
                        <div class='previewtimestamp'>${pic.timestamp}</div>
                    </div>
                </div>`;
                })}
        `;
    }

    /*
    protected shouldUpdate(changedProps: PropertyValues): boolean {
        if(changedProps.has("availableCams") || 
            changedProps.has("selectedCam")
        )
            return false;
        else
            return hasConfigOrEntityChanged(this, changedProps);
    }
*/

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
        this.localpath = this.entityObj.attributes.path.replace(this.patch_replace,'local');
        this._hass = hass;

        if(this.cam_entity)
            this.camObj = hass.states[this.cam_entity];

        // Initialize?
        if(this.fileListobj != this.entityObj.attributes.fileList) {
            this.fileListobj = this.entityObj.attributes.fileList
            this._init();
        }
            
    }



    /**
     * Called every time when entity config is updated
     * @param config Card configuration (yaml converted to JSON)
     */
    setConfig(config: ICardConfig): void {
        this.entity = config.entity;
        if(config.title)
            this.cardTitle = config.title;
        this.patch_replace = config.path_replace;
        this.cam_entity = config.cam_entity;
    }

    connectedCallback(): void {
        super.connectedCallback();
        // INIT
        this.availableDays = Object.keys(this.entityObj.attributes.fileList);
    }

}

