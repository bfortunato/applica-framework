"use strict";

import {EntitiesStore} from "../../../stores/entities";
import {connectDiscriminated} from "../../utils/aj";
import AbstractEntitiesGrid from "./abstractEntitiesGrid";

export default class EntitiesGrid extends AbstractEntitiesGrid {
    constructor(props) {
        super(props)

        this.state.query.on("change", () => {
            this.onQueryChanged()
        })


        this.discriminator = "entity_grid_" + this.getEntity()

        connectDiscriminated(this.discriminator, this, [EntitiesStore])
    }
}

