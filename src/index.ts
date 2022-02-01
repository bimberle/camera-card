import { MyCameraArchiveCard } from "./custom-element/kech-camera-archive-card";
import { printVersion } from "./utils";

// Registering card
customElements.define("kech-camera-archive-card", MyCameraArchiveCard);

printVersion();