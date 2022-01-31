import { HomeAssistant } from "../ha-types";
import { html, css, LitElement, CSSResultGroup, TemplateResult, PropertyValues } from "lit";
import { property } from "lit/decorators";
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

    private selectedDay: string = ""
    private selectedHour: string = "";
    private selectedCam: string = "";
    private selectedPic: string = "";

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
        console.log("Hour selected:" + hour);
        this.selectedHour = hour;
        this.availableCams = Object.keys(this.gallery[this.selectedDay][this.selectedHour]) as Array<string>;
        this._selectCam();
    }

    private _selectCam(cam?: string) :void {
        if(cam == undefined && this.availableCams && this.selectedCam == "")
            cam = this.availableCams[0];                
        if(cam)
            this.selectedCam = cam;
        const newPics: Array<Picture> = [];
        //this.availablePics.splice(0, this.availablePics.length);
        Object.entries(this.gallery[this.selectedDay][this.selectedHour][this.selectedCam]).forEach((thisobj, index) => {
            var picurl = this.localpath + thisobj[1];
            newPics.push({ timestamp: thisobj[0], url: picurl})
        })

        // TODO
        // this.availablePics kommt nicht bei HTML an, dort ist das Object noch alt

        this.availablePics = newPics;
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
                        ${this.renderDays()}
                        ${this.renderHours()}
                        ${this.renderCams()}
                        ${this.availablePics.length > 0 ? this.renderPictures() : ''}
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
            ${this.availableDays?.map((tag: string) => {
                return html`
                <paper-tab @click=${() => this._selectDay(tag)}>${tag}</paper-tab>
                `;
            })}
            </paper-tabs>
        </div>
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
        console.log("Pictures: " + this.availablePics.length);
        return html`
            <div id='pics'>
                ${this.availablePics.map((pic: Picture) => {
                    return html`<div class='previews'><img src=${pic.url} class='previews'><div class='previewtimestamp'>${pic.timestamp}</div></div>`;
                    })}
            
            </div>
        `;
    }

    protected shouldUpdate(changedProps: PropertyValues): boolean {
        if(changedProps.has("availableCams") || 
            changedProps.has("selectedCam")
        )
            return false;
        else
            return hasConfigOrEntityChanged(this, changedProps);
      }


    //protected updated(changedProperties: PropertyValues): void {
    //    super.updated(changedProperties);
    //}

}

