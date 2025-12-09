class ChargerCardDSJ extends HTMLElement {

  setConfig(config) {
    if (!config.device_id) {
      throw new Error("device_id is verplicht");
    }
  
    this._config = {
      device_id: config.device_id,
      charger_color: config.charger_color || "white"
    };
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  entity(id) {
    const prefix = this._config.device_id;
    const full = `sensor.${prefix}_${id}`;
    return this._hass.states[full]?.state ?? null;
  }

  val(id) {
    const v = parseFloat(this.entity(id));
    return isNaN(v) ? 0 : v;
  }

  getAnimationSpeed(amp) {
    if (amp <= 6) return "1.8s";
    if (amp <= 16) return "1.2s";
    return "0.7s";
  }

  // Charger body image
  getBodyImage(color) {
    return `/hacsfiles/Charger-Card-DSJ/images/charger_${color}.png`;
  }

  // LED animations (only for certain statuses)
  getLEDImage(status) {
    const base = "/hacsfiles/Charger-Card-DSJ/images";

    switch (status) {
      case "charging":
        return `${base}/leds_blue_all.gif`;
      case "completed":
        return `${base}/leds_white_all.gif`;
      case "awaiting_authorization":
        return `${base}/leds_white_flashing.gif`;
      case "error":
        return `${base}/leds_red_flashing.gif`;
      case "disconnected":
        return `${base}/leds_off.gif`;
      default:
        return null; 
    }
  }

  getStatus(status) {
    return {
      disconnected: "Geen auto aangesloten",
      charging: "Bezig met laden",
      completed: "Laden voltooid",
      ready_to_charge: "Gereed om te laden",
      awaiting_authorization: "Wacht op goedkeuring"
    }[status] || status;
  }

  getError(status) {
    return {
      not_requesting_current: "Geen stroomvraag",
      car_not_charging: "Auto laadt niet",
      limited_by_charger_max_limit: "Begrensd door lader",
      limited_by_equalizer: "Begrensd door equalizer",
      pending_authorization: "Wacht op goedkeuring",
      limited_by_cable_rating: "Kabelbegrenzing",
      limited_by_car: "Begrensd door auto"
    }[status] || status;
  }

  icon(i) {
    return `<ha-icon icon="${i}" style="padding-right:8px;"></ha-icon>`;
  }

  render() {
    if (!this._hass || !this._config) return;

    const color = this._config.charger_color;
    const status = this.entity("status");
    const error = this.entity("reden_geen_stroom");
    const amp = this.val("laadstroom");

    const bodyImage = this.getBodyImage(color);
    const ledImage = this.getLEDImage(status);

    // We kiezen LED animatie, tenzij status dat niet ondersteunt
    const isAnimated = !!ledImage;
    const image = ledImage || bodyImage;

    const animationSpeed = this.getAnimationSpeed(amp);

    this.innerHTML = `
    <style>
      .card {
        padding: 16px;
        display: grid;
        grid-template-areas:
          "icon power voltage"
          "icon sessie amp"
          "icon limit our"
          "icon status status"
          "icon error error";
        grid-template-columns: 1fr max-content 1fr;
        color: var(--gray800);
      }

      img.charger {
        width: 140px;
        height: auto;
      }

      img.animated {
        animation: flicker linear infinite;
      }

      @keyframes flicker {
        0% { opacity: 1; }
        50% { opacity: 0.65; }
        100% { opacity: 1; }
      }
    </style>

    <ha-card>
      <div class="card">

        <div style="grid-area: icon;">
          <img class="charger ${isAnimated ? "animated" : ""}"
               src="${image}" 
               style="${isAnimated ? `animation-duration:${animationSpeed};` : ""}">
        </div>

        <div class="status" style="grid-area: status;">
          ${this.icon("mdi:ev-plug-type2")} ${this.getStatus(status)}
        </div>

        <div class="power" style="grid-area: power;">
          ${this.icon("mdi:lightning-bolt")}
          ${this.val("vermogen").toFixed(1)} kW
        </div>

        <div class="sessie" style="grid-area: sessie;">
          ${this.icon("mdi:battery")}
          ${this.val("sessie_energie").toFixed(1)} kWh
        </div>

        <div class="amp" style="grid-area: amp;">
          ${this.icon("mdi:current-ac")}
          ${amp.toFixed(1)} A
        </div>

        <div class="our" style="grid-area: our;">
          ${this.icon("mdi:clock")}
          ${this.val("energie_per_uur").toFixed(1)} kWh
        </div>

        <div class="limit" style="grid-area: limit;">
          ${this.icon("mdi:gauge")}
          ${this.entity("maximale_limiet_lader")} A
        </div>

        <div class="voltage" style="grid-area: voltage;">
          ${this.icon("mdi:sine-wave")}
          ${this.val("voltage").toFixed(1)} V
        </div>

        <div class="error" style="grid-area: error;">
          ${this.getError(error)}
        </div>

      </div>
    </ha-card>
    `;
  }

  getCardSize() { return 4; }
}

customElements.define("charger-card-dsj", ChargerCardDSJ);
